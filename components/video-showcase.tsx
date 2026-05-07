export function VideoShowcase() {
  return (
    <section className="texture-stone relative py-24 bg-background border-y border-border">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold tracking-[0.2em] text-foreground uppercase">
            Trailer <span className="text-primary">Oficial</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-20 bg-primary" />
        </div>

        <div className="texture-iron relative aspect-video overflow-hidden border-4 border-border shadow-2xl">
          <div className="rivet top-2 left-2" />
          <div className="rivet top-2 right-2" />
          <div className="rivet bottom-2 left-2" />
          <div className="rivet bottom-2 right-2" />
          
          <iframe
            src="https://www.youtube.com/embed/-13-ApdmUk4"
            title="TrhynumAO Trailer"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <div className="mt-8 text-center">
          <p className="font-serif text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Sumergite en el continente de Trhynum
          </p>
        </div>
      </div>
    </section>
  )
}
