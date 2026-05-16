import { Redis } from '@upstash/redis';
import { NextResponse } from "next/server"
import net from "net"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export async function GET() {
  const host = "149.104.76.210"
  const port = 7666

  const checkStatus = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const socket = new net.Socket()
      const timeout = 2000

      socket.setTimeout(timeout)

      socket.on("connect", () => {
        socket.destroy()
        resolve(true)
      })

      socket.on("timeout", () => {
        socket.destroy()
        resolve(false)
      })

      socket.on("error", () => {
        socket.destroy()
        resolve(false)
      })

      socket.connect(port, host)
    })
  }

  try {
    // 1. Chequeo de conexión TCP al VPS
    const isOnline = await checkStatus()
    
    // 2. Intento de obtener usuarios de Upstash Redis
    let onlines = 0
    try {
      const kvValue = await redis.get<number>('onlines_count')
      onlines = kvValue !== null ? Number(kvValue) : 0
    } catch (kvError) {
      console.error("Error al acceder a Upstash Redis:", kvError)
    }
    
    return NextResponse.json(
      { online: isOnline, onlines: onlines },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
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
