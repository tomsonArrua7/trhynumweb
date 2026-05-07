import { Crown, Shield, Sword } from "lucide-react"

const staffMembers = [
  { name: "DarkLord", role: "Administrador", description: "Fundador del servidor y desarrollador principal", icon: Crown },
  { name: "ShadowMage", role: "Game Master", description: "Encargado de eventos y soporte al jugador", icon: Shield },
  { name: "IronWarrior", role: "Game Master", description: "Moderación y asistencia en el juego", icon: Shield },
  { name: "NightBlade", role: "Moderador", description: "Soporte en Discord y foros", icon: Sword },
]

export function Staff() {
  return (
    <section id="staff" className="texture-stone relative py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold tracking-[0.2em] text-foreground uppercase">
            Equipo de <span className="text-primary">Guerra</span>
          </h2>
          <div className="mt-4 mx-auto h-1 w-24 bg-primary" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {staffMembers.map((member) => (
            <div 
              key={member.name}
              className="texture-iron p-8 flex flex-col items-center text-center group hover:border-primary/50 transition-all"
            >
              <div className="rivet top-2 left-2" />
              <div className="rivet top-2 right-2" />
              <div className="rivet bottom-2 left-2" />
              <div className="rivet bottom-2 right-2" />
              
              <div className="relative mb-6">
                <div className="flex h-20 w-20 items-center justify-center bg-black border-2 border-border group-hover:border-primary transition-colors">
                  <span className="font-serif text-2xl font-bold text-foreground">
                    {member.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-primary p-1.5 border border-black shadow-[0_0_10px_rgba(255,0,0,0.3)]">
                  <member.icon className="h-4 w-4 text-white" />
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold tracking-widest text-foreground uppercase">
                {member.name}
              </h3>
              <p className="mt-1 text-xs font-bold tracking-widest text-primary uppercase">
                {member.role}
              </p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed italic">
                "{member.description}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
