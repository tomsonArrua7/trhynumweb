import Image from "next/image"

export function Footer() {
  return (
    <footer className="texture-stone relative py-16 bg-card border-t-4 border-border">
      {/* Rivets for heavy feel */}
      <div className="rivet top-2 left-2" />
      <div className="rivet top-2 right-2" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          {/* Logo Area */}
          <div className="relative h-12 w-48 opacity-80 hover:opacity-100 transition-opacity">
            <Image 
              src="/assets/logo_metal.png" 
              alt="TrhynumAO" 
              fill 
              className="object-contain"
            />
          </div>

          {/* Description */}
          <p className="max-w-md font-serif text-sm tracking-widest text-muted-foreground uppercase">
            El servidor definitivo de Argentum Online. 
            <br />
            <span className="text-primary/70">Basado en motor DX8 (Mod Fénix).</span>
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 text-xs font-bold tracking-[0.2em] text-foreground/60">
            {["INICIO", "DESCARGAS", "WIKI", "STAFF"].map((link) => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Copyright Area */}
          <div className="mt-8 w-full border-t border-border/50 pt-8">
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              © 2026 TrhynumAO. Forjado en el continente de Trhynum.
            </p>
            <p className="mt-2 text-[10px] text-muted-foreground/40 max-w-2xl mx-auto italic">
              Argentum Online es un proyecto de código abierto. Este servidor es una iniciativa independiente dedicada a preservar la esencia del agite puro.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
