import { NextResponse } from "next/server";

const packs: Record<string, { title: string; price: number }> = {
  "250": {
    title: "250 Trhynum Points - Donación",
    price: 5000.00
  },
  "500": {
    title: "500 Trhynum Points - Donación",
    price: 10000.00
  },
  "750": {
    title: "750 Trhynum Points - Donación",
    price: 15000.00
  },
  "1500": {
    title: "1500 Trhynum Points - Donación",
    price: 30000.00
  },
  "3000": {
    title: "3000 Trhynum Points - Donación (Promoción)",
    price: 40000.00
  }
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nickname = searchParams.get("nickname") || "";
    const packId = searchParams.get("pack") || "";

    // Sanitizar Nickname
    const nicknameCleaned = nickname
      .replace(/[^\w\s\-\[\]]/gu, "")
      .replace(/[|\r\n\t]/g, "")
      .trim();

    if (!nicknameCleaned) {
      return new Response("Error: El nombre del personaje es requerido.", { status: 400 });
    }

    if (!packs[packId]) {
      return new Response("Error: El paquete de donación seleccionado no es válido.", { status: 400 });
    }

    const selectedPack = packs[packId];
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return new Response("Error de Servidor: Las credenciales de Mercado Pago no están configuradas.", { status: 500 });
    }

    // Configurar URLs dinámicas para el webhook y los retornos
    const host = req.headers.get("host") || "";
    const protocol = req.url.startsWith("https") ? "https://" : "http://";
    const baseUrl = `${protocol}${host}`;

    const preferenceData = {
      items: [
        {
          title: selectedPack.title,
          quantity: 1,
          unit_price: selectedPack.price,
          currency_id: "ARS"
        }
      ],
      external_reference: nicknameCleaned,
      back_urls: {
        success: `${baseUrl}/#donar`,
        failure: `${baseUrl}/#donar`,
        pending: `${baseUrl}/#donar`
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/donacion-webhook`
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preferenceData)
    });

    const result = await mpRes.json();

    if (mpRes.status !== 200 && mpRes.status !== 201) {
      console.error("Mercado Pago API Error:", result);
      return new Response(`Error al procesar el pago con Mercado Pago: ${result.message || "Respuesta desconocida"}`, { status: 500 });
    }

    if (result.init_point) {
      return NextResponse.redirect(result.init_point);
    } else {
      return new Response("Error de API: No se pudo obtener el punto de inicio de la pasarela.", { status: 500 });
    }
  } catch (error: any) {
    console.error("Critical error in donacion-checkout:", error);
    return new Response(`Internal Server Error: ${error.message || error}`, { status: 500 });
  }
}
