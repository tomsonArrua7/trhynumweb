import { NextResponse } from "next/server"
import net from "net"
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

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
    const isOnline = await checkStatus()
    let onlinesCount = 0
    
    if (isOnline) {
      try {
        const count = await redis.get<number>('onlines_count')
        onlinesCount = count ?? 0
      } catch (redisErr) {
        console.error("Error loading onlines_count from Redis:", redisErr)
      }
    }
    
    return NextResponse.json(
      { online: isOnline, onlines: onlinesCount },
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
      error: "Internal check failed"
    }, { status: 500 })
  }
}
