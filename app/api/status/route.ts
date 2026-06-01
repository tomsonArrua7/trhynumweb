import { NextResponse } from "next/server"
import net from "net"
import { Redis } from "@upstash/redis"

export async function GET() {
  const host = "149.104.76.210"
  const port = 7666

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const redis = (redisUrl && redisToken && redisUrl.startsWith("https")) 
    ? new Redis({ url: redisUrl, token: redisToken }) 
    : null;

  // 1. Intentar obtener el estado desde la caché de Redis
  if (redis) {
    try {
      // Intentar leer datos de actualización del VPS (update-onlines)
      const lastUpdate = await redis.get<number>("last_online_update");
      const onlinesCount = await redis.get<number>("onlines_count");
      
      const now = Date.now();
      
      // Si la VPS actualizó hace menos de 4 minutos (240000 ms), consideramos el servidor ONLINE directamente
      if (lastUpdate && (now - lastUpdate) < 240000) {
        return NextResponse.json(
          { online: true, onlines: onlinesCount ?? 0, source: "vps_push" },
          {
            status: 200,
            headers: {
              'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5'
            }
          }
        );
      }

      // Si no hay push reciente del VPS, ver si tenemos una consulta TCP en caché (TTL 30s)
      const cachedStatus = await redis.get<{ online: boolean; onlines: number; timestamp: number }>("server_status_cache");
      if (cachedStatus && (now - cachedStatus.timestamp) < 30000) {
        return NextResponse.json(
          { online: cachedStatus.online, onlines: cachedStatus.onlines, source: "tcp_cache" },
          {
            status: 200,
            headers: {
              'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5'
            }
          }
        );
      }
    } catch (redisErr) {
      console.error("[Status API] Error leyendo de Redis:", redisErr);
    }
  }

  // 2. Si no hay caché válida o Redis no está configurado, realizamos la consulta TCP directa al VPS
  const checkStatus = (): Promise<{ online: boolean; onlines: number }> => {
    return new Promise((resolve) => {
      const socket = new net.Socket()
      const timeout = 2500
      let onlinesCount = 0
      let connected = false

      socket.setTimeout(timeout)

      socket.on("connect", () => {
        connected = true
        // Enviar comando para solicitar usuarios online al VPS
        socket.write("GETONLINES")
      })

      socket.on("data", (data) => {
        const response = data.toString().trim()
        console.log(`[TCP Status] Respuesta recibida: ${response}`)

        // Formato esperado: "ONLINES:X"
        if (response.startsWith("ONLINES:")) {
          const parts = response.split(":")
          if (parts[1] && !isNaN(Number(parts[1]))) {
            onlinesCount = parseInt(parts[1], 10)
          }
        }
        socket.destroy()
        resolve({ online: true, onlines: onlinesCount })
      })

      socket.on("timeout", () => {
        socket.destroy()
        resolve({ online: connected, onlines: 0 })
      })

      socket.on("error", (err) => {
        console.error("[TCP Status] Error de conexión:", err.message)
        socket.destroy()
        resolve({ online: false, onlines: 0 })
      })

      socket.connect(port, host)
    })
  }

  try {
    const statusData = await checkStatus()
    
    // 3. Guardar en caché de Redis para las próximas consultas (TTL 30s)
    if (redis) {
      try {
        await redis.set("server_status_cache", {
          online: statusData.online,
          onlines: statusData.onlines,
          timestamp: Date.now()
        }, { ex: 30 }); // Expiración de 30 segundos en Redis
      } catch (redisWriteErr) {
        console.error("[Status API] Error escribiendo caché en Redis:", redisWriteErr);
      }
    }
    
    return NextResponse.json(
      { online: statusData.online, onlines: statusData.onlines, source: "tcp_live" },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=5'
        }
      }
    );
  } catch (error) {
    console.error("Error crítico en API Status:", error)
    return NextResponse.json({ 
      online: false, 
      onlines: 0,
      error: "Internal check failed"
    }, { status: 500 })
  }
}
