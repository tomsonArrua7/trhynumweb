import { NextResponse } from "next/server";
import net from "net";
import { Redis } from "@upstash/redis";

function calcularPuntos(monto: number): number {
  const montoInt = Math.round(monto);
  switch (montoInt) {
    case 5000:  return 250;
    case 10000: return 500;
    case 15000: return 750;
    case 30000: return 1500;
    case 40000: return 3000; // Pack Promocional
    default:    return Math.floor(monto / 20);
  }
}

function enviarAcreditacionTCP(paymentId: string, nickname: string, puntos: number): Promise<boolean> {
  return new Promise((resolve) => {
    const host = "149.104.76.210";
    const port = 7666;
    const secretToken = process.env.TCP_SECRET_TOKEN || "TuClaveSuperSecreta";
    const packet = `ADD_TRHYN|${secretToken}|${nickname}|${puntos}|${paymentId}`;

    console.log(`[TCP] Intentando conexión a ${host}:${port} para ${nickname} (${puntos} pts)...`);
    const socket = new net.Socket();
    socket.setTimeout(3000);

    socket.on("connect", () => {
      socket.write(packet, () => {
        console.log(`[TCP] Paquete enviado con éxito. Cerrando socket.`);
        socket.destroy();
        resolve(true);
      });
    });

    socket.on("error", (err) => {
      console.error("[TCP] Error de socket:", err.message);
      socket.destroy();
      resolve(false);
    });

    socket.on("timeout", () => {
      console.error("[TCP] Timeout de conexión superado.");
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

export async function POST(req: Request) {
  try {
    let paymentId: string | null = null;
    
    // Intentar leer JSON en POST (Webhook oficial)
    const rawBody = await req.text();
    let jsonData: any = {};
    try {
      jsonData = JSON.parse(rawBody);
    } catch (e) {}

    if (jsonData && jsonData.data && jsonData.data.id) {
      paymentId = String(jsonData.data.id);
    } else if (jsonData && jsonData.resource) {
      const parts = jsonData.resource.split("/");
      paymentId = parts[parts.length - 1];
    }

    if (!paymentId) {
      // Intentar leer de parámetros URL (IPN GET fallback)
      const { searchParams } = new URL(req.url);
      const idParam = searchParams.get("id");
      const dataIdParam = searchParams.get("data_id");
      const typeParam = searchParams.get("type") || searchParams.get("topic") || "";

      if (typeParam === "payment") {
        paymentId = dataIdParam || idParam;
      }
    }

    if (!paymentId || isNaN(Number(paymentId))) {
      console.warn("[Webhook] Notificación recibida sin ID de pago válido.");
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 });
    }

    console.log(`[Webhook] Procesando pago ID: ${paymentId}`);

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("[Webhook] Error: Token de Mercado Pago no configurado.");
      return NextResponse.json({ error: "MP Access Token not configured" }, { status: 500 });
    }

    // Consultar detalles del pago a la API de Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (mpRes.status !== 200) {
      console.error(`[Webhook] Error consultando pago ${paymentId}: HTTP ${mpRes.status}`);
      return NextResponse.json({ error: "Error fetching payment details" }, { status: 500 });
    }

    const paymentData = await mpRes.json();
    const status = paymentData.status;
    const externalReference = paymentData.external_reference || "";
    const transactionAmount = Number(paymentData.transaction_amount || 0);

    console.log(`[Webhook] Pago ${paymentId} consultado. Estado: ${status}, Referencia: ${externalReference}, Monto: ${transactionAmount}`);

    if (status !== "approved") {
      return NextResponse.json({ message: `Ignored status: ${status}` }, { status: 200 });
    }

    const nickname = externalReference
      .replace(/[^\w\s\-\[\]]/gu, "")
      .replace(/[|\r\n\t]/g, "")
      .trim();

    // Inicialización dinámica y perezosa de Redis
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    const redis = (redisUrl && redisToken && redisUrl.startsWith("https"))
      ? new Redis({ url: redisUrl, token: redisToken })
      : null;

    if (!nickname) {
      console.error(`[Webhook] Pago aprobado sin external_reference (nickname) válido.`);
      
      const contingencia = {
        payment_id: paymentId,
        timestamp: new Date().toISOString(),
        monto: transactionAmount,
        nickname: "DESCONOCIDO_ERROR_PREFERENCIA",
        puntos: calcularPuntos(transactionAmount),
        motivo: "Falta external_reference en preferencia"
      };

      if (redis) {
        await redis.lpush("contingencias_donaciones", JSON.stringify(contingencia));
      } else {
        console.warn("[Webhook] Redis no configurado. No se pudo guardar contingencia (Falta Nickname).");
      }
      
      return NextResponse.json({ message: "Approved but nickname was missing, saved in Redis pending." }, { status: 200 });
    }

    const puntos = calcularPuntos(transactionAmount);
    if (puntos <= 0) {
      return NextResponse.json({ error: "Invalid points calculated" }, { status: 400 });
    }

    // Enviar acreditación TCP al VPS del juego
    const tcpSuccess = await enviarAcreditacionTCP(paymentId, nickname, puntos);

    if (!tcpSuccess) {
      console.warn(`[Webhook] Servidor de juego offline. Guardando donación en Redis para acreditación posterior.`);
      const contingencia = {
        payment_id: paymentId,
        timestamp: new Date().toISOString(),
        monto: transactionAmount,
        nickname: nickname,
        puntos: puntos,
        motivo: "TCP Server Offline/Unreachable"
      };

      if (redis) {
        await redis.lpush("contingencias_donaciones", JSON.stringify(contingencia));
      } else {
        console.warn("[Webhook] Redis no configurado. No se pudo guardar contingencia (TCP Offline).");
      }
    }

    return NextResponse.json({
      status: "success",
      acredited: {
        payment_id: paymentId,
        nickname,
        amount: transactionAmount,
        points: puntos,
        tcp_sent: tcpSuccess
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("[Webhook] Error crítico procesando webhook:", error);
    return NextResponse.json({ error: error.message || error }, { status: 500 });
  }
}

// Permitir llamadas GET para IPN
export async function GET(req: Request) {
  return POST(req);
}
