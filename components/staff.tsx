import { Crown, Sword } from "lucide-react"

export function Staff() {
  return (
    <section id="staff" className="texture-stone relative py-24 bg-background border-t-2 border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-[0.2em] text-foreground uppercase">
            El <span className="text-primary">Staff</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-primary" />
        </div>

        <div className="mx-auto max-w-4xl space-y-12">

          {/* Director */}
          <div>
            <div className="texture-iron mb-4 flex items-center gap-3 p-3 border-l-4 border-l-primary">
              <Crown className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-xs font-bold tracking-[0.3em] text-primary uppercase">
                Director del Proyecto
              </h3>
            </div>

            <div className="texture-iron p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 sm:gap-8">
              <div className="rivet top-2 left-2" />
              <div className="rivet top-2 right-2" />
              <div className="rivet bottom-2 left-2" />
              <div className="rivet bottom-2 right-2" />
              
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="relative flex h-20 w-20 items-center justify-center bg-black border-2 border-primary shadow-[0_0_20px_rgba(255,0,0,0.2)]">
                  <span className="font-serif text-2xl font-bold text-foreground">BE</span>
                  <div className="absolute -bottom-2 -right-2 bg-primary p-1.5 border border-black">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="font-serif text-2xl font-bold tracking-widest text-foreground uppercase">Benedict</p>
                <p className="mt-1 font-serif text-sm font-bold tracking-widest text-primary/80 uppercase">Tomás</p>
                <p className="mt-3 text-sm text-muted-foreground italic">Fundador y desarrollador principal de TrhynumAO.</p>
              </div>
            </div>
          </div>

          {/* Game Masters */}
          <div>
            <div className="texture-iron mb-4 flex items-center gap-3 p-3 border-l-4 border-l-border">
              <Sword className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-serif text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">
                Game Masters
              </h3>
            </div>

            <div className="texture-iron p-12 flex flex-col items-center justify-center text-center gap-3 min-h-[120px]">
              <div className="rivet top-2 left-2" />
              <div className="rivet top-2 right-2" />
              <div className="rivet bottom-2 left-2" />
              <div className="rivet bottom-2 right-2" />
              <Sword className="h-8 w-8 text-border" />
              <p className="font-serif text-sm tracking-widest text-muted-foreground/50 uppercase italic">
                Plazas en formación — próximamente
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
