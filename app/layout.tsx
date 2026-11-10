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
  metadataBase: new URL("https://www.trhynumao.com.ar"),
  applicationName: "TrhynumAO",
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
  title: {
    default: "TrhynumAO: Argentum Online de agite",
    template: "%s | TrhynumAO",
  },
  description:
    "Servidor argentino de Argentum Online centrado en el combate entre jugadores: retos, torneos con llave automática, ranking por Elo y un evento nuevo cada 15 minutos.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/marca/icono.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180" },
  },
  openGraph: {
    title: "TrhynumAO",
    siteName: "TrhynumAO",
    url: "/",
    description: "Argentum Online de agite: retos, torneos, Elo y un evento cada 15 minutos.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "TrhynumAO, Argentum Online de agite" }],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrhynumAO",
    description: "Argentum Online de agite: retos, torneos, Elo y un evento cada 15 minutos.",
    images: ["/og.png"],
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
