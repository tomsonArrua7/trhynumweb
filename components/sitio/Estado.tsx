"use client"

import { useEffect, useState } from "react"

type Estado = "revisando" | "online" | "offline" | "sin-dato"

const textos: Record<Estado, string> = {
  "sin-dato": "",
  revisando: "Revisando el servidor",
  online: "Servidor en línea",
  offline: "Servidor fuera de línea",
}

// Una sola consulta por visita. La respuesta de /api/status esta guardada 60 segundos.
export function EstadoServidor() {
  const [estado, setEstado] = useState<Estado>("revisando")

  useEffect(() => {
    let vivo = true
    fetch("/api/status")
      .then((r) => r.json())
      .then((d) => vivo && setEstado(d.online === null ? "sin-dato" : d.online ? "online" : "offline"))
      .catch(() => vivo && setEstado("sin-dato"))
    return () => {
      vivo = false
    }
  }, [])

  // Sin direccion configurada o sin respuesta de la web: no se muestra nada antes que un dato falso.
  if (estado === "sin-dato") return null

  return (
    <p className="estado" data-estado={estado} role="status">
      <i aria-hidden="true" />
      {textos[estado]}
    </p>
  )
}

// El cliente del juego abre /#wiki: lo mandamos a la wiki nueva.
export function AnclasViejas() {
  useEffect(() => {
    if (window.location.hash === "#wiki") window.location.replace("/wiki")
  }, [])
  return null
}
