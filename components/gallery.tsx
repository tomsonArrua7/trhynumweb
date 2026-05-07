import Image from "next/image"

const items = [
  { id: "16036", name: "Ítem Legendario" },
  { id: "16038", name: "Reliquia de Trhynum" },
  { id: "18206", name: "Artefacto Antiguo" },
  { id: "195", name: "Consumible Raro" },
  { id: "3", name: "Gema de Poder" },
]

export function Gallery() {
  return (
    <section className="texture-stone relative py-12 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="mb-8 font-serif text-xs tracking-[0.3em] text-primary/60 uppercase">
          Tesoros del Continente
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col items-center">
              <div className="relative h-16 w-16 bg-black/40 border border-border/50 transition-all group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(255,0,0,0.1)]">
                <Image
                  src={`/assets/${item.id}.bmp`}
                  alt={item.name}
                  fill
                  className="ao-sprite object-contain p-2"
                />
              </div>
              <span className="mt-2 font-serif text-[10px] tracking-widest text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
