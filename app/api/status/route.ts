import { NextResponse } from "next/server"
import net from "net"

export async function GET() {
  const host = "149.104.76.210"
  const port = 7666

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
    
    return NextResponse.json(
      { online: statusData.online, onlines: statusData.onlines },
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
