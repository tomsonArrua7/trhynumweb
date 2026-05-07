import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen w-full overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/hero_background.png"
          alt="Dark Fortress"
          fill
          className="object-cover brightness-[0.4] contrast-125"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background" />
      </div>

      {/* Smoke Overlay Effect */}
      <div className="smoke-overlay animate-smoke opacity-30" />

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* NEW MESSAGE BADGE */}
        <div className="mb-8 inline-flex animate-pulse-crimson items-center justify-center border-2 border-primary/50 bg-black/80 px-6 py-2 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
          <span className="font-serif text-sm font-bold tracking-[0.3em] text-primary">
            TOTALMENTE NUEVO, CONSTRUIDO DE CERO
          </span>
        </div>

        {/* Core Message */}
        <h1 className="font-serif text-6xl font-bold tracking-tighter text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="block drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">TrhynumAO</span>
        </h1>
        
        <p className="mt-6 max-w-2xl font-serif text-xl tracking-widest text-foreground/80 sm:text-2xl">
          Servidor basado en DX8 (Mod Fénix). <span className="text-primary">Agite puro.</span>
        </p>

        {/* CTA Button */}
        <div className="mt-12">
          <a href="#descargas">
            <Button
              size="lg"
              className="texture-stone relative h-20 w-64 border-2 border-primary bg-primary text-xl font-bold tracking-[0.2em] text-white transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]"
            >
              <div className="rivet top-1 left-1" />
              <div className="rivet top-1 right-1" />
              <div className="rivet bottom-1 left-1" />
              <div className="rivet bottom-1 right-1" />
              JUGAR AHORA
            </Button>
          </a>
        </div>
      </div>

      {/* Bottom Heavy Border Shadow */}
      <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-background to-transparent shadow-[0_-20px_50px_rgba(0,0,0,0.8)]" />
    </section>
  )
}
