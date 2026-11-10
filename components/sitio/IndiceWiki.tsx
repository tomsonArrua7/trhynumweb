"use client"

import { useEffect, useState } from "react"

type Seccion = { id: string; titulo: string }

export function IndiceWiki({ secciones }: { secciones: Seccion[] }) {
  const [busqueda, setBusqueda] = useState("")
  const [visibles, setVisibles] = useState<string[] | null>(null)
  const [activa, setActiva] = useState(secciones[0]?.id)

  // Filtra las secciones cuyo texto contiene lo buscado.
  useEffect(() => {
    const t = busqueda.trim().toLowerCase()
    const ids: string[] = []
    document.querySelectorAll<HTMLElement>("#contenido > section").forEach((s) => {
      const ok = !t || (s.textContent || "").toLowerCase().includes(t)
      s.classList.toggle("hide", !ok)
      if (ok) ids.push(s.id)
    })
    setVisibles(t ? ids : null)
  }, [busqueda])

  // Marca en el indice la seccion que se esta leyendo.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id))
      },
      { rootMargin: "-20% 0px -70% 0px" },
    )
    document.querySelectorAll("#contenido > section").forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const lista = visibles ? secciones.filter((s) => visibles.includes(s.id)) : secciones

  return (
    <nav className="wiki-indice" aria-label="Índice de la wiki">
      <label className="oculto-visual" htmlFor="buscar-wiki">
        Buscar en la wiki
      </label>
      <input
        id="buscar-wiki"
        type="search"
        placeholder="Buscar en la wiki"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <ol>
        {lista.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className={s.id === activa ? "activo" : undefined}>
              {s.titulo}
            </a>
          </li>
        ))}
      </ol>
      {visibles && lista.length === 0 && <p className="wiki-vacio">No hay resultados para esa búsqueda.</p>}
    </nav>
  )
}
