import Image from "next/image"
import { Sword, Shield, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      title: "Personajes Legendarios",
      description: "Personalización profunda con armaduras de obsidiana y habilidades únicas.",
      image: "/assets/character_render.png",
      icon: <Shield className="h-6 w-6 text-primary" />,
    },
    {
      title: "Artefactos de Poder",
      description: "Descubrí items milenarios forjados en el fuego del continente.",
      image: "/assets/unique_item.png",
      icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
      title: "Batallas Brutales",
      description: "El sistema de combate DX8 más fluido, optimizado para el agite puro.",
      image: "/assets/battle_scene.png",
      icon: <Sword className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <section id="features" className="texture-stone relative py-24 bg-background border-t-2 border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-[0.2em] text-foreground uppercase">
            Características <span className="text-primary">Únicas</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-primary" />
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div 
              key={feature.title}
              className="texture-iron flex flex-col overflow-hidden group transition-all hover:scale-[1.02]"
            >
              {/* Rivets */}
              <div className="rivet top-2 left-2" />
              <div className="rivet top-2 right-2" />
              <div className="rivet bottom-2 left-2" />
              <div className="rivet bottom-2 right-2" />

              {/* Image Frame */}
              <div className="relative h-64 w-full overflow-hidden border-b border-border">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center bg-black border border-primary/30 shadow-[0_0_10px_rgba(255,0,0,0.1)]">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-xl font-bold tracking-widest text-foreground uppercase mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
