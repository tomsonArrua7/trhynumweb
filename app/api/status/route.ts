import net from "net"

// Estado del servidor del juego: una sola conexion TCP que se abre y se cierra,
// sin mandar datos. La respuesta queda guardada 60 segundos, asi que por mas
// visitas que tenga la web el host del juego recibe como mucho un intento por
// minuto. No usa Redis ni ningun servicio externo.
export const dynamic = "force-static"
export const revalidate = 60

const HOST = process.env.GAME_HOST || "149.104.76.210"
const PORT = Number(process.env.GAME_PORT || 7666)

function probar(): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    let listo = false
    const fin = (online: boolean) => {
      if (listo) return
      listo = true
      socket.destroy()
      resolve(online)
    }
    socket.setTimeout(2500)
    socket.once("connect", () => fin(true))
    socket.once("timeout", () => fin(false))
    socket.once("error", () => fin(false))
    socket.connect(PORT, HOST)
  })
}

export async function GET() {
  const online = await probar()
  return Response.json(
    { online, revisado: Date.now() },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  )
}
