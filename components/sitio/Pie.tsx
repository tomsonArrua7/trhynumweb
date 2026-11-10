import Link from "next/link"
import { enlaces } from "@/lib/sitio"
import { Logo } from "./Cabecera"

export function Pie() {
  return (
    <footer className="pie">
      <div className="contenedor">
        <div>
          <Logo />
          <p>
            Servidor público e independiente de Argentum Online, hosteado en Argentina. Argentum Online pertenece a sus
            respectivos dueños.
          </p>
        </div>
        <nav aria-label="Pie de página">
          <Link href="/#descargas">Descargar</Link>
          <Link href="/wiki">Wiki</Link>
          <Link href="/#staff">Staff</Link>
          <a href={enlaces.discord} target="_blank" rel="noopener noreferrer">
            Discord
          </a>
          <a href={enlaces.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={enlaces.whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </nav>
      </div>
    </footer>
  )
}
