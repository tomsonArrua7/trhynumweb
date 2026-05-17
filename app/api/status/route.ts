import { NextResponse } from "next/server"
import net from "net"

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
    
    return NextResponse.json(
      { online: isOnline },
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
