import { Cpu, MemoryStick as Memory, HardDrive, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Downloads() {
  const downloadLinks = [
    { 
      name: "Descarga Directa", 
      size: "47 MB", 
      description: "Descarga directa desde nuestro servidor.",
      url: "/downloads/Instalador_TrhynumAO.exe" 
    },
    { 
      name: "Mirror Mediafire", 
      size: "47 MB", 
      description: "Opción de descarga alternativa.",
      url: "https://www.mediafire.com/file/uzt5yvf7hgblrwl/Instalador_TrhynumAO.exe/file" 
    },
    { 
      name: "Mirror MEGA", 
      size: "47 MB", 
      description: "Opción de descarga alternativa.",
      url: "#" 
    },
  ]

  const requirements = [
    { icon: <Cpu className="h-5 w-5" />, label: "CPU", value: "Intel Core i3 o superior" },
    { icon: <Memory className="h-5 w-5" />, label: "RAM", value: "4 GB DDR3" },
    { icon: <HardDrive className="h-5 w-5" />, label: "Disco", value: "200 MB espacio libre" },
  ]

  return (
    <section id="descargas" className="texture-stone relative py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-[0.2em] text-foreground uppercase">
            Centro de <span className="text-primary">Descargas</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-primary" />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Download Panels */}
          <div className="space-y-6">
            {downloadLinks.map((link) => (
              <div 
                key={link.name}
                className="texture-iron p-8 group transition-all hover:border-primary/50"
              >
                <div className="rivet top-2 left-2" />
                <div className="rivet top-2 right-2" />
                <div className="rivet bottom-2 left-2" />
                <div className="rivet bottom-2 right-2" />
                
                <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-6">
                  <div className="text-center sm:text-left">
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-foreground">{link.name}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{link.description}</p>
                    <span className="mt-2 inline-block text-[10px] sm:text-xs font-bold text-primary uppercase">{link.size}</span>
                  </div>
                  <a href={link.url} download={link.name === "Descarga Directa"} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button className="texture-stone w-full bg-secondary border border-border group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                      <Download className="h-5 w-5 mr-2" />
                      BAJAR
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* System Requirements Panel */}
          <div className="texture-iron p-10 bg-card/50">
            <div className="rivet top-2 left-2" />
            <div className="rivet top-2 right-2" />
            <div className="rivet bottom-2 left-2" />
            <div className="rivet bottom-2 right-2" />
            
            <h3 className="font-serif text-2xl font-bold tracking-widest text-foreground uppercase mb-8">
              Requisitos del <span className="text-primary">Sistema</span>
            </h3>
            
            <div className="space-y-8">
              {requirements.map((req) => (
                <div key={req.label} className="flex items-center gap-6 border-b border-border/50 pb-6 last:border-0 last:pb-0">
                  <div className="flex h-12 w-12 items-center justify-center bg-black border border-primary/30 text-primary shadow-[0_0_10px_rgba(255,0,0,0.1)]">
                    {req.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">{req.label}</p>
                    <p className="mt-1 font-serif text-lg text-foreground">{req.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-4 border border-primary/20 bg-primary/5">
              <p className="text-xs text-muted-foreground leading-relaxed italic">
                * El juego requiere DirectX 8.0 o superior para funcionar correctamente. Asegurate de tener los controladores actualizados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
