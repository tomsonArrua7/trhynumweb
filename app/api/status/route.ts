import { NextResponse } from "next/server"
import { kv } from '@vercel/kv'
import net from "net"

export const dynamic = "force-dynamic"

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
    
    // 2. Intento de obtener usuarios de KV (con su propio try/catch)
    let onlines = 0
    try {
      const kvValue = await kv.get<number>('onlines_count')
      onlines = kvValue !== null ? Number(kvValue) : 0
    } catch (kvError) {
      console.error("Error al acceder a Vercel KV:", kvError)
      // No lanzamos el error para que el status principal siga funcionando
    }
    
    return NextResponse.json({ 
      online: isOnline,
      onlines: onlines
    })
  } catch (error) {
    console.error("Error crítico en API Status:", error)
    return NextResponse.json({ 
      online: false, 
      onlines: 0,
      error: "Internal check failed"
    }, { status: 500 })
  }
}
