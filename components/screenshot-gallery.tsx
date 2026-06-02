"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const screenshots = [
  { id: 1, src: "/assets/image1.webp", title: "Captura 1" },
  { id: 2, src: "/assets/image3.webp", title: "Captura 2" },
  { id: 3, src: "/assets/foto1.webp", title: "Captura 3" },
  { id: 4, src: "/assets/foto2.webp", title: "Captura 4" },
  { id: 5, src: "/assets/foto3.webp", title: "Captura 5" },
  { id: 6, src: "/assets/foto4.webp", title: "Captura 6" },
  { id: 7, src: "/assets/foto5.webp", title: "Captura 7" },
  { id: 8, src: "/assets/foto6.webp", title: "Captura 8" },
  { id: 9, src: "/assets/Screenshot_01062026_212710.webp", title: "Captura 9" },
  { id: 10, src: "/assets/Screenshot_01062026_214553.webp", title: "Captura 10" },
  { id: 11, src: "/assets/Screenshot_01062026_215924.webp", title: "Captura 11" },
  { id: 12, src: "/assets/Screenshot_01062026_220128.webp", title: "Captura 12" },
  { id: 13, src: "/assets/Screenshot_01062026_220203.webp", title: "Captura 13" },
  { id: 14, src: "/assets/Screenshot_01062026_220217.webp", title: "Captura 14" },
  { id: 15, src: "/assets/Screenshot_01062026_233306.webp", title: "Captura 15" },
]

export function ScreenshotGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Start or reset the auto-rotation timer
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length)
    }, 8000)
  }

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length)
    startTimer() // Reset timer on manual action
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length)
    startTimer() // Reset timer on manual action
  }

  const selectIndex = (index: number) => {
    setCurrentIndex(index)
    startTimer() // Reset timer on manual action
  }

  return (
    <section className="texture-stone relative py-20 bg-[#050508] overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-[0.2em] text-white uppercase">
            Galería de <span className="text-red-600 drop-shadow-[0_0_8px_rgba(255,0,0,0.2)]">Imágenes</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-red-700" />
        </div>

        {/* Carousel Container */}
        <div className="relative mx-auto max-w-5xl">
          {/* Main Image View */}
          <div className="texture-iron relative aspect-[4/3] sm:aspect-video w-full overflow-hidden border-4 border-obsidian-border bg-black shadow-2xl">
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
                    src={shot.src}
                    alt={shot.title}
                    fill
                    className="object-contain p-2 cursor-zoom-in hover:scale-[1.01] transition-transform duration-300"
                    priority={shot.id === 1}
                    unoptimized
                    onClick={() => setLightboxSrc(shot.src)}
                  />
                </div>
              ))}
            </div>

            {/* Overlay Navigation Buttons */}
            <button 
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/70 p-3 text-red-500 border border-red-950/40 hover:bg-red-800 hover:text-white transition-all z-20 shadow-md cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <button 
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/70 p-3 text-red-500 border border-red-950/40 hover:bg-red-800 hover:text-white transition-all z-20 shadow-md cursor-pointer"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="mt-6 flex justify-center gap-3">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={() => selectIndex(i)}
                className={`w-2.5 h-2.5 rotate-45 border transition-all duration-300 cursor-pointer ${
                  i === currentIndex 
                    ? "bg-red-800 border-yellow-500 shadow-[0_0_10px_rgba(139,0,0,0.8)] scale-125" 
                    : "border-slate-800 bg-[#0d0d14] hover:bg-red-800/40"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="mt-8 text-center font-serif text-[10px] tracking-[0.4em] text-slate-500 uppercase animate-pulse">
          Deslizá para ver el mundo de Trhynum
        </p>
      </div>

      {/* Lightbox Modal */}
      {lightboxSrc && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in transition-all duration-300"
          onClick={() => setLightboxSrc(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors focus:outline-none cursor-pointer" 
            onClick={() => setLightboxSrc(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative max-w-[90vw] max-h-[85vh] border-3 border-obsidian-border bg-black shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxSrc} 
              alt="Zoomed View" 
              className="max-w-[90vw] max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  )
}
