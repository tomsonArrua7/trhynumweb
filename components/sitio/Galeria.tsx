"use client"

import { useRef, useState } from "react"
import type { Captura } from "@/lib/sitio"

export function Galeria({ capturas }: { capturas: Captura[] }) {
  const visor = useRef<HTMLDialogElement>(null)
  const [i, setI] = useState(0)

  const abrir = (n: number) => {
    setI(n)
    visor.current?.showModal()
  }
  const mover = (d: number) => setI((n) => (n + d + capturas.length) % capturas.length)

  return (
    <>
      <ul className="capturas">
        {capturas.map((c, n) => (
          <li key={c.src}>
            <button type="button" onClick={() => abrir(n)} aria-label={`Ampliar: ${c.alt}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.alt} loading="lazy" width={1024} height={768} />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={visor}
        className="visor"
        onClick={(e) => e.target === visor.current && visor.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") mover(1)
          if (e.key === "ArrowLeft") mover(-1)
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={capturas[i].src} alt={capturas[i].alt} />
        <form method="dialog">
          <span>
            <button type="button" className="boton" onClick={() => mover(-1)}>
              Anterior
            </button>{" "}
            <button type="button" className="boton" onClick={() => mover(1)}>
              Siguiente
            </button>
          </span>
          <span>
            {i + 1} de {capturas.length}
          </span>
          <button className="boton">Cerrar</button>
        </form>
      </dialog>
    </>
  )
}

export function Trailer({ id }: { id: string }) {
  const [activo, setActivo] = useState(false)
  return (
    <div className="trailer">
      {activo ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title="Trailer de TrhynumAO"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <button type="button" onClick={() => setActivo(true)}>
            <span>Ver el trailer</span>
          </button>
        </>
      )}
    </div>
  )
}
