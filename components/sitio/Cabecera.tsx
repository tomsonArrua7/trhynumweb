import Link from "next/link"
import { enlaces } from "@/lib/sitio"

export function Logo() {
  return (
    <span className="logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/logo.webp" alt="TrhynumAO" width={965} height={296} />
    </span>
  )
}

const secciones = [
  { href: "/#eventos", texto: "Eventos" },
  { href: "/#capturas", texto: "Capturas" },
  { href: "/wiki", texto: "Wiki" },
]

export function Cabecera({ actual }: { actual?: "wiki" }) {
  return (
    <header className="cabecera">
      <div className="contenedor">
        <Link href="/" aria-label="TrhynumAO, ir al inicio">
          <Logo />
        </Link>

        <nav className="menu" aria-label="Principal">
          {secciones.map((s) => (
            <Link key={s.href} href={s.href} aria-current={actual === "wiki" && s.href === "/wiki" ? "page" : undefined}>
              {s.texto}
            </Link>
          ))}
          <a href={enlaces.discord} target="_blank" rel="noopener noreferrer">
            Discord
          </a>
          <Link href="/#descargas" className="boton boton-principal">
            Descargar
          </Link>
        </nav>

        <details className="menu-movil">
          <summary>Menú</summary>
          <nav aria-label="Principal">
            {secciones.map((s) => (
              <Link key={s.href} href={s.href}>
                {s.texto}
              </Link>
            ))}
            <a href={enlaces.discord} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <Link href="/#descargas">Descargar el juego</Link>
          </nav>
        </details>
      </div>
    </header>
  )
}
