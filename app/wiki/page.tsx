import fs from "fs"
import path from "path"
import type { Metadata } from "next"
import { Cabecera } from "@/components/sitio/Cabecera"
import { Pie } from "@/components/sitio/Pie"
import { IndiceWiki } from "@/components/sitio/IndiceWiki"

export const metadata: Metadata = {
  title: "Wiki",
  description:
    "Todo lo que hace falta para jugar TrhynumAO: monedas, retos, Elo, torneos, eventos, facciones, clanes, hechizos y tienda.",
}

// El texto de la wiki vive en content/wiki.html: para corregir un dato se edita ese archivo.
export default function Wiki() {
  const html = fs.readFileSync(path.join(process.cwd(), "content", "wiki.html"), "utf8")
  const secciones = [...html.matchAll(/<section id="([^"]+)">\s*<h2>(.*?)<\/h2>/g)].map((m) => ({
    id: m[1],
    titulo: m[2],
  }))

  return (
    <>
      <Cabecera actual="wiki" />
      <header className="wiki-cabeza">
        <div className="contenedor">
          <h1>Wiki de TrhynumAO</h1>
          <p>
            Monedas, retos, Elo, torneos, eventos, facciones, clanes y tienda. Los números salen de la configuración
            real del servidor.
          </p>
        </div>
      </header>
      <div className="contenedor wiki">
        <IndiceWiki secciones={secciones} />
        <main className="wiki-texto" id="contenido" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <Pie />
    </>
  )
}
