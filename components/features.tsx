import Image from "next/image"
import { Swords, Shield, Zap } from "lucide-react"

const features = [
  {
    title: "Mundo Persistente",
    description: "Explorá el continente de Trhynum. Desde Ullathorpe hasta las islas faccionarias.",
    image: "/assets/foto1.png",
    icon: Shield,
  },
  {
    title: "Agite de Selección",
    description: "Sistemas de retos 1v1 y 2v2 balanceados para la mejor experiencia competitiva.",
    image: "/assets/foto2.png",
    icon: Swords,
    isSprite: true,
  },
  {
    title: "Items Legendarios",
    description: "Conseguí los mejores canjes participando en torneos y dominando el ranking.",
    image: "/assets/unique_item.png",
    icon: Zap,
  },
]

export function Features() {
  return (
    <section id="features" className="texture-stone relative py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="texture-iron group relative p-8">
              <div className="rivet top-2 left-2" />
              <div className="rivet top-2 right-2" />
              <div className="rivet bottom-2 left-2" />
              <div className="rivet bottom-2 right-2" />
              
              <div className="mb-6 flex h-12 w-12 items-center justify-center bg-primary/20 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-4 font-serif text-xl font-bold tracking-widest text-foreground uppercase group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>

              <div className="relative aspect-video overflow-hidden border border-border bg-black">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-110 ${feature.isSprite ? 'ao-sprite' : 'brightness-75'}`}
                />
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}
