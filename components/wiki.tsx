import { BookOpen, Users, Map, Scroll, FlaskConical, Axe } from "lucide-react"

const guides = [
  { icon: Users, title: "Guía de Clases", description: "Conocé todas las clases disponibles y sus habilidades únicas" },
  { icon: Map, title: "Mapas de Agite", description: "Explorá las zonas de combate PvP más intensas del servidor" },
  { icon: Scroll, title: "Sistema de Quests", description: "Misiones épicas con recompensas exclusivas" },
  { icon: FlaskConical, title: "Alquimia", description: "Creá pociones y equipamiento legendario" },
  { icon: Axe, title: "Guía de Combate", description: "Dominá las mecánicas de combate PvP y PvE" },
  { icon: BookOpen, title: "Comandos", description: "Lista completa de comandos disponibles" },
]

export function Wiki() {
  return (
    <section id="wiki" className="texture-stone relative py-24 bg-background border-t-2 border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-[0.2em] text-foreground uppercase">
            Biblioteca de <span className="text-primary">Trhynum</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-primary" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <div 
              key={guide.title}
              className="texture-iron p-6 group cursor-pointer transition-all hover:border-primary/50"
            >
              <div className="rivet top-2 left-2" />
              <div className="rivet top-2 right-2" />
              <div className="rivet bottom-2 left-2" />
              <div className="rivet bottom-2 right-2" />
              
              <div className="flex items-start gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-black border border-primary/30 group-hover:border-primary transition-colors">
                  <guide.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold tracking-widest text-foreground uppercase group-hover:text-primary transition-colors">
                    {guide.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
