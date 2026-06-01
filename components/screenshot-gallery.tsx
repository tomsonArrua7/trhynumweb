"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const screenshots = [
  { id: 1, title: "Captura 1" },
  { id: 2, title: "Captura 2" },
  { id: 3, title: "Captura 3" },
  { id: 4, title: "Captura 4" },
  { id: 5, title: "Captura 5" },
  { id: 6, title: "Captura 6" },
]

export function ScreenshotGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((prev) => (prev + 1) % screenshots.length)
  const prev = () => setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)

  return (
    <section className="texture-stone relative py-24 bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-[0.2em] text-foreground uppercase">
            Galería de <span className="text-primary">Imágenes</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-primary" />
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto max-w-5xl">
          {/* Main Image View */}
          <div className="texture-iron relative aspect-[4/3] sm:aspect-video w-full overflow-hidden border-4 border-border bg-black shadow-2xl">
            <div className="rivet top-2 left-2" />
            <div className="rivet top-2 right-2" />
            <div className="rivet bottom-2 left-2" />
            <div className="rivet bottom-2 right-2" />
            
            <div 
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {screenshots.map((shot) => (
                <div key={shot.id} className="relative h-full w-full flex-shrink-0">
                  <Image
                    src={`/assets/foto${shot.id}.webp`}
                    alt={shot.title}
                    fill
                    className="object-contain p-2"
                    priority={shot.id === 1}
                  />
                </div>
              ))}
            </div>

            {/* Overlay Navigation Buttons */}
            <button 
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-2 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all z-20"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button 
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 p-2 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all z-20"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="mt-6 flex justify-center gap-3">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 w-8 transition-all ${
                  i === currentIndex ? "bg-primary shadow-[0_0_10px_rgba(255,0,0,0.5)]" : "bg-border hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-center font-serif text-[10px] tracking-[0.4em] text-muted-foreground uppercase animate-pulse">
          Deslizá para ver el mundo de Trhynum
        </p>
      </div>
    </section>
  )
}
