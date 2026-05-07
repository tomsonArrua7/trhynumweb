import Image from "next/image"

const screenshots = [
  { id: 1, title: "Agite en Ullathorpe" },
  { id: 2, title: "Arenas de Reto" },
  { id: 3, title: "Invasiones" },
  { id: 4, title: "Duelos Apostados" },
  { id: 5, title: "Comercio" },
  { id: 6, title: "Exploración" },
]

export function ScreenshotGallery() {
  return (
    <section className="texture-stone relative py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-[0.2em] text-foreground uppercase">
            Capturas de <span className="text-primary">Pantalla</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-primary" />
          <p className="mt-6 font-serif text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Momentos épicos en el continente
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {screenshots.map((shot) => (
            <div 
              key={shot.id} 
              className="texture-iron group relative aspect-video overflow-hidden border-2 border-border bg-card transition-all hover:border-primary/50"
            >
              <div className="rivet top-1 left-1 w-1 h-1" />
              <div className="rivet top-1 right-1 w-1 h-1" />
              <div className="rivet bottom-1 left-1 w-1 h-1" />
              <div className="rivet bottom-1 right-1 w-1 h-1" />
              
              <Image
                src={`/assets/foto${shot.id}.png`}
                alt={shot.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="p-4">
                  <p className="font-serif text-xs font-bold tracking-[0.2em] text-primary uppercase">
                    {shot.title}
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
