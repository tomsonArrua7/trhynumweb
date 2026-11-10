import type { Metadata, Viewport } from "next"
import { Grenze_Gotisch, Alegreya_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Las dos tipografias son de fundiciones argentinas (Omnibus-Type y Huerta Tipografica).
const titulo = Grenze_Gotisch({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--f-titulo",
  display: "swap",
})

const texto = Alegreya_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--f-texto",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://trhynumao.com.ar"),
  title: {
    default: "TrhynumAO: Argentum Online de agite",
    template: "%s | TrhynumAO",
  },
  description:
    "Servidor argentino de Argentum Online centrado en el combate entre jugadores: retos, torneos con llave automática, ranking por Elo y un evento nuevo cada 15 minutos.",
  icons: { icon: "/assets/Icono.ico" },
  openGraph: {
    title: "TrhynumAO",
    description: "Argentum Online de agite: retos, torneos, Elo y un evento cada 15 minutos.",
    images: ["/assets/capturas/portada.webp"],
    locale: "es_AR",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0e0a0c",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR" className={`${titulo.variable} ${texto.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
