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
    const isOnline = await checkStatus()
    const onlines = await kv.get<number>('onlines_count') || 0
    
    return NextResponse.json({ 
      online: isOnline,
      onlines: onlines
    })
  } catch (error) {
    return NextResponse.json({ online: false, onlines: 0 }, { status: 500 })
  }
}
