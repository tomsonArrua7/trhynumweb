import Image from "next/image"

const items = [
  { id: "13619" }, { id: "16023" }, { id: "16036" }, { id: "16038" },
  { id: "16040" }, { id: "16044" }, { id: "16052" }, { id: "16072" },
  { id: "16092" }, { id: "16102" }, { id: "16114" }, { id: "16116" },
  { id: "16118" }, { id: "16120" }, { id: "16122" }, { id: "16124" },
  { id: "16135" }, { id: "16136" }, { id: "18206" }, { id: "195" },
  { id: "2023" }, { id: "3" }, { id: "895" }, { id: "897" },
]

export function Gallery() {
  return (
    <section className="texture-stone relative py-12 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="mb-8 font-serif text-xs tracking-[0.3em] text-primary/60 uppercase">
          Tesoros del Continente
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
          {items.map((item) => (
            <div key={item.id} className="group relative flex flex-col items-center">
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 bg-black/40 border border-border/50 transition-all group-hover:border-primary/50 group-hover:shadow-[0_0_15px_rgba(255,0,0,0.1)]">
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
