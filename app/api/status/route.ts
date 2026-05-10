import { NextResponse } from "next/server"
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
    return NextResponse.json({ online: isOnline })
  } catch (error) {
    return NextResponse.json({ online: false }, { status: 500 })
  }
}
