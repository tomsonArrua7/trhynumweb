import type { Metadata } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const cinzel = Cinzel({ 
  subsets: ["latin"],
  variable: '--font-serif'
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  title: 'Trhynum AO - Argentum Online',
  description: 'Servidor Público - Hosteado en Argentina. Basado en motor DX8 (Mod Fénix). Diseñado para el agite puro y la competencia. Entrá, equipate y dominá el continente de Trhynum.',
  generator: 'v0.app',
  icons: {
    icon: '/assets/Icono.ico',
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${cinzel.variable} ${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
