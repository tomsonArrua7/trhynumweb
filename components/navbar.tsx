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
            <div className="relative h-12 w-48">
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
          </div>

          {/* Mobile Menu Button (Simplified) */}
          <button className="flex flex-col gap-1.5 md:hidden">
            <div className="h-0.5 w-6 bg-foreground" />
            <div className="h-0.5 w-6 bg-foreground" />
            <div className="h-0.5 w-6 bg-foreground" />
          </button>
        </nav>
      </div>
    </header>
  )
}
