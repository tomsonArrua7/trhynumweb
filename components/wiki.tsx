import Image from "next/image"
import {
  Swords,
  Shield,
  Trophy,
  Skull,
  Users,
  Zap,
  ChevronDown,
  BookOpen,
} from "lucide-react"

// ─── Data from wiki_trhynum.md (Part 2 — Player Guide) ──────────────────────

const wikiSections = [
  {
    id: "evolucion",
    icon: Zap,
    title: "Evolución y Zonas",
    image: "/assets/character_render.png",
    content: `El nivel máximo es **45**. El servidor te guía automáticamente por zonas de leveo según tu nivel.`,
    table: {
      headers: ["Nivel", "Zona"],
      rows: [
        ["1 – 13", "Mapa de Entrenamiento (spawn inicial)"],
        ["14 – 25", "Segunda zona de leveo"],
        ["26 – 34", "Tercera zona"],
        ["35 – 44", "Cuarta zona — empieza el agite"],
        ["45", "Ullathorpe — ciudad del agite full"],
      ],
    },
    note: "Al alcanzar ciertos hitos de nivel elegís una Subclase que potencia tu clase base. Como ciudadano, tu único camino de combate es el Luchador. Cada subclase otorga hasta 3 Recompensas permanentes: ítems, HP extra o Mana extra.",
  },
  {
    id: "retos",
    icon: Swords,
    title: "Sistema de Retos",
    image: "/assets/arena_retos.png",
    content: `El sistema de combate directo del servidor. Tres modalidades, todas sin respawn.`,
    cards: [
      {
        title: "Retos 1v1 (Baldosas)",
        steps: [
          "Andá a la zona de Arenas de Reto en Ullathorpe.",
          "Pará sobre tu baldosa. Si el rival para en la suya al mismo tiempo, el reto empieza automático.",
          "Mejor de 1 — primer muerto pierde.",
          "El ganador cobra Oro (x1.5 del precio base) y suma un frag.",
          "Al terminar, ambos son warpeados curados con inventario limpio.",
        ],
        commands: ["/BLOQRETOS 1 — rechazar retos", "/BLOQRETOS 0 — aceptar retos"],
        note: "Hay 12 arenas simultáneas. Si una está ocupada, probá más abajo.",
      },
      {
        title: "Retos Apostados",
        steps: [
          "Apuntá al rival y escribí /APUESTA <monto>.",
          "El rival acepta con /ACEPTARAPUESTA.",
          "El que gana se lleva todo.",
        ],
        commands: [],
        note: null,
      },
      {
        title: "Retos 2v2",
        steps: [
          "Misma mecánica que los 1v1 pero en parejas.",
          "Coordiná con tu compañero para pisar las baldosas al mismo tiempo.",
        ],
        commands: [],
        note: null,
      },
    ],
  },
  {
    id: "deathmatch",
    icon: Skull,
    title: "Deathmatch",
    image: "/assets/deathmatch_banner.png",
    content: `Cuando el servidor anuncia un Deathmatch, escribí /PARTICIPAR para inscribirte.`,
    cards: [
      {
        title: "Free For All",
        steps: [
          "Escribí /PARTICIPAR cuando el servidor lo anuncie.",
          "Es un Free For All — todos contra todos.",
          "Al morir sos warpeado afuera. Sin respawn.",
          "El último en pie gana 15 Puntos de Canje + 1 Punto de Quest.",
        ],
        commands: ["/PARTICIPAR — inscribirse al DM activo"],
        note: null,
      },
    ],
  },
  {
    id: "rankings",
    icon: Trophy,
    title: "Rankings Semanales",
    image: "/assets/ranking_trophy.png",
    content: `Dos rankings independientes que se resetean cada 7 días. Al final de cada semana, el Top 1 es coronado con anuncio global.`,
    table: {
      headers: ["Ranking", "Premio Top 1"],
      rows: [
        ["1v1", "200 Puntos de Canje"],
        ["2v2", "100 Puntos de Canje"],
      ],
    },
    note: "Anti-farmeo: el sistema bloquea puntos si peleás siempre contra el mismo rival (historial de últimas 5 peleas). Consultá el ranking con /RANKING.",
  },
  {
    id: "clanes",
    icon: Shield,
    title: "Clanes y Gremios",
    image: "/assets/clan_banner.png",
    content: `Los clanes son el corazón del agite organizado. Alcanzá el nivel y oro requeridos, luego usá el menú de gremio para crear el tuyo.`,
    cards: [
      {
        title: "Como Líder podés",
        steps: [
          "Reclutar miembros.",
          "Declarar enemigos y aliados a otros clanes.",
          "Coordinar en el chat de gremio.",
        ],
        commands: [],
        note: "El sistema de Castillo de Clanes (dominación) está en desarrollo. Cuando esté activo, el clan dominante recibirá recompensas exclusivas.",
      },
    ],
  },
  {
    id: "tips",
    icon: BookOpen,
    title: "Tips Fundamentales",
    image: null,
    content: null,
    tips: [
      {
        num: "01",
        title: "Puntos de Canje",
        desc: "Son la moneda del endgame. Se ganan en Deathmatch, Rankings y Quests. Son lo que te separa del equipo bueno del equipo de cartón.",
      },
      {
        num: "02",
        title: "Seguro de Retos",
        desc: "Si estás farmeando o no querés interrupciones, activá /BLOQRETOS 1. No hay excusas de 'me retaron de sorpresa'.",
      },
      {
        num: "03",
        title: "Stamina",
        desc: "El sistema penaliza atacar sin stamina. Llevá pociones si vas a una arena prolongada o a un DM.",
      },
      {
        num: "04",
        title: "El Mapa Importa",
        desc: "En zonas de leveo no hay PVP activo. En Ullathorpe y las arenas, es zona libre. Conocé dónde empieza el agite real.",
      },
      {
        num: "05",
        title: "Consultá el Ranking",
        desc: "Si el tipo que te reta está en el Top 3, es porque sabe pelear. Preparate o bloqueá hasta estar listo.",
      },
    ],
  },
]

// ────────────────────────────────────────────────────────────────────────────

export function Wiki() {
  return (
    <section id="wiki" className="texture-stone relative py-24 bg-background border-t-2 border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-20 flex flex-col items-center text-center">
          <div className="relative mb-8 h-48 sm:h-64 w-full max-w-4xl overflow-hidden border-2 border-border shadow-2xl">
            <Image
              src="/assets/wiki_banner.png"
              alt="Biblioteca de Trhynum"
              fill
              className="object-cover brightness-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <BookOpen className="mb-2 h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-foreground uppercase">
                Biblioteca de <span className="text-primary">Trhynum</span>
              </h2>
              <p className="mt-2 text-[10px] sm:text-sm tracking-widest text-muted-foreground uppercase">
                Guía Oficial del Servidor
              </p>
            </div>
          </div>

          {/* Jump links */}
          <nav className="flex flex-wrap justify-center gap-3">
            {wikiSections.map((s) => (
              <a
                key={s.id}
                href={`#wiki-${s.id}`}
                className="flex items-center gap-2 border border-border bg-card px-4 py-2 font-serif text-xs font-bold tracking-widest text-foreground/70 uppercase transition-all hover:border-primary hover:text-primary"
              >
                <s.icon className="h-3 w-3" />
                {s.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Sections */}
        <div className="space-y-16">
          {wikiSections.map((section) => (
            <div key={section.id} id={`wiki-${section.id}`} className="scroll-mt-24">
              {/* Section title bar */}
              <div className="texture-iron mb-8 flex items-center gap-4 p-4 border-l-4 border-l-primary">
                <div className="rivet top-2 right-2" />
                <div className="rivet bottom-2 right-2" />
                <section.icon className="h-6 w-6 shrink-0 text-primary" />
                <h3 className="font-serif text-2xl font-bold tracking-[0.15em] text-foreground uppercase">
                  {section.title}
                </h3>
              </div>

              {/* Image + intro */}
              {section.image && (
                <div className="mb-8 flex flex-col md:grid md:grid-cols-3 gap-8">
                  <div className="relative h-48 sm:h-64 overflow-hidden border-2 border-border">
                    <Image src={section.image} alt={section.title} fill className="object-cover brightness-50 grayscale" />
                  </div>
                  <div className="md:col-span-2">
                    {section.content && (
                      <p className="font-serif text-base sm:text-lg text-foreground/90 leading-relaxed">{section.content}</p>
                    )}
                    {section.note && (
                      <p className="mt-4 border-l-2 border-primary/40 pl-4 text-xs sm:text-sm italic text-muted-foreground">{section.note}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Table */}
              {section.table && (
                <div className="mb-8 overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-primary/10">
                        {section.table.headers.map((h) => (
                          <th key={h} className="border border-border px-6 py-3 text-left font-serif text-xs font-bold tracking-widest text-primary uppercase">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-card/30" : "bg-background"}>
                          {row.map((cell, j) => (
                            <td key={j} className={`border border-border/50 px-6 py-3 ${j === 0 ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Cards with steps */}
              {section.cards && (
                <div className={`grid grid-cols-1 gap-6 ${section.cards.length > 1 ? "md:grid-cols-" + Math.min(section.cards.length, 3) : ""}`}>
                  {section.cards.map((card) => (
                    <div key={card.title} className="texture-iron p-6">
                      <div className="rivet top-2 left-2" />
                      <div className="rivet top-2 right-2" />
                      <div className="rivet bottom-2 left-2" />
                      <div className="rivet bottom-2 right-2" />
                      <h4 className="mb-4 font-serif text-lg font-bold tracking-widest text-foreground uppercase border-b border-border/50 pb-2">
                        {card.title}
                      </h4>
                      <ol className="space-y-2">
                        {card.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-primary/20 text-[10px] font-bold text-primary">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                      {card.commands.length > 0 && (
                        <div className="mt-4 space-y-1">
                          {card.commands.map((cmd) => (
                            <code key={cmd} className="block bg-black/50 px-3 py-1.5 text-xs text-primary border border-primary/20">
                              {cmd}
                            </code>
                          ))}
                        </div>
                      )}
                      {card.note && (
                        <p className="mt-4 border-l-2 border-primary/40 pl-3 text-xs italic text-muted-foreground">{card.note}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tips grid */}
              {section.tips && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {section.tips.map((tip) => (
                    <div key={tip.num} className="texture-iron p-6 group transition-all hover:border-primary/50">
                      <div className="rivet top-2 left-2" />
                      <div className="rivet bottom-2 right-2" />
                      <span className="font-serif text-4xl font-bold text-primary/20 leading-none">{tip.num}</span>
                      <h4 className="mt-2 font-serif text-base font-bold tracking-widest text-foreground uppercase group-hover:text-primary transition-colors">
                        {tip.title}
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-20 border-t border-border/50 pt-8 text-center">
          <p className="font-serif text-sm text-muted-foreground italic">
            ¿Dudas? Consultá en Discord o en el chat global.
            <br />
            <span className="text-primary/70">La comunidad orienta, pero el frag lo ganás vos.</span>
          </p>
        </div>

      </div>
    </section>
  )
}
