import Image from "next/image"

const items = [
  { id: "16036" },
  { id: "16038" },
  { id: "18206" },
  { id: "195" },
  { id: "3" },
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
                  alt="Item"
                  fill
                  className="ao-sprite object-contain p-2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
