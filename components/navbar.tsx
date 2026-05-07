import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Obsidian Stone Bar */}
      <div className="texture-stone relative h-20 w-full bg-card border-b-2 border-border shadow-2xl">
        {/* Rivets for iron feel */}
        <div className="rivet top-2 left-2" />
        <div className="rivet top-2 right-2" />
        <div className="rivet bottom-2 left-2" />
        <div className="rivet bottom-2 right-2" />
        
        <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          {/* Logo Area */}
          <Link href="/" className="group flex items-center gap-2 transition-transform hover:scale-105">
            <div className="relative h-10 w-32 sm:h-12 sm:w-48">
              <Image 
                src="/assets/logo_metal.png" 
                alt="TrhynumAO" 
                fill 
                className="object-contain drop-shadow-[0_0_8px_rgba(255,0,0,0.3)]"
                priority
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            {["INICIO", "Descargas", "Wiki", "Staff"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="group relative font-serif text-sm font-bold tracking-[0.2em] text-foreground/80 transition-colors hover:text-primary"
              >
                <span className="relative z-10">{item}</span>
                <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <a 
              href="https://discord.gg/eS7eeDeSGT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="texture-stone border border-primary/50 bg-primary/10 px-4 py-2 font-serif text-[10px] font-bold tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-[0_0_15px_rgba(255,0,0,0.1)]"
            >
              DISCORD / AYUDA
            </a>
          </div>

          {/* Mobile Discord Link & Menu */}
          <div className="flex items-center gap-4 md:hidden">
            <a 
              href="https://discord.gg/eS7eeDeSGT" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <button className="flex flex-col gap-1.5">
              <div className="h-0.5 w-6 bg-foreground" />
              <div className="h-0.5 w-6 bg-foreground" />
              <div className="h-0.5 w-6 bg-foreground" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
