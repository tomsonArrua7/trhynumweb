import Image from "next/image"
import { ServerStatus } from "./server-status"

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen w-full overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero_background.webp"
          alt="Fortaleza de Trhynum"
          fill
          className="object-cover brightness-[0.35] contrast-125 saturate-0"
          priority
        />
        {/* Heavy vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>


      {/* Center content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">

        {/* Top ornamental rule */}
        <div className="mb-10 flex items-center gap-4 w-full max-w-xs">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="h-1.5 w-1.5 rotate-45 bg-primary" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        {/* Server label */}
        <p className="mb-4 px-4 font-serif text-[8px] sm:text-[10px] font-bold tracking-[0.3em] sm:tracking-[0.5em] text-primary/80 uppercase">
          Servidor Público · Hosteado en Argentina · Mod Fénix DX8
        </p>

        {/* Main title */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-9xl font-bold tracking-tight text-foreground"
            style={{ textShadow: "0 0 40px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,1)" }}>
          TrhynumAO
        </h1>

        {/* Subtitle */}
        <p className="mt-6 px-4 font-serif text-xs sm:text-base tracking-[0.2em] sm:tracking-[0.3em] text-foreground/60 uppercase sm:text-lg">
          Agite Puro &nbsp;·&nbsp; Construido de Cero
        </p>

        {/* Bottom ornamental rule */}
        {/* Server Status */}
        <ServerStatus />

        {/* CTA */}
        <div className="mt-12">
          <a href="#descargas">
            <button
              className="group relative h-16 w-56 overflow-hidden border-2 border-primary bg-primary/10 font-serif text-base font-bold tracking-[0.3em] text-white uppercase transition-all duration-300 hover:bg-primary hover:shadow-[0_0_40px_rgba(180,0,0,0.5)]"
            >
              {/* Shimmer on hover */}
              <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
              Jugar Ahora
            </button>
          </a>
          <a 
            href="https://discord.gg/eS7eeDeSGT" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 block font-serif text-[10px] tracking-[0.2em] text-primary hover:text-white transition-colors uppercase font-bold"
          >
            [ Canal de Ayuda / Discord ]
          </a>
        </div>

        {/* Scroll hint */}
        <p className="mt-16 font-serif text-[9px] tracking-[0.4em] text-foreground/30 uppercase animate-pulse">
          ↓ Descubrí el servidor
        </p>

      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 h-40 w-full bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
