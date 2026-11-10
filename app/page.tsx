import Link from "next/link"
import { Cabecera, Logo } from "@/components/sitio/Cabecera"
import { Pie } from "@/components/sitio/Pie"
import { EstadoServidor, AnclasViejas } from "@/components/sitio/Estado"
import { Galeria, Trailer } from "@/components/sitio/Galeria"
import { capturaPortada, capturas, ciclo, descarga, enlaces, ligas, requisitos, staff } from "@/lib/sitio"

export default function Inicio() {
  return (
    <>
      <AnclasViejas />
      <Cabecera />

      <main>
        <section className="portada">
          <div className="contenedor">
            <div>
              <Logo completo />
              <h1>Argentum Online para el que entra a pelear</h1>
              <p className="bajada">
                Llegás a nivel 45 en un rato. Lo que sigue es lo largo: retos, torneos con llave automática, ranking por
                Elo y un evento nuevo cada 15 minutos.
              </p>
              <div className="acciones">
                <a className="boton boton-principal" href="#descargas">
                  Descargar el juego {descarga.peso && <small>{descarga.peso}</small>}
                </a>
                <Link className="boton" href="/wiki">
                  Leer la wiki
                </Link>
              </div>
              <EstadoServidor />
            </div>

            <figure className="ventana">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturaPortada.src} alt={capturaPortada.alt} width={1024} height={768} fetchPriority="high" />
              <figcaption>Ullathorpe, la ciudad principal: skins, misiones y forja a pasos de la fuente.</figcaption>
            </figure>
          </div>
        </section>

        <section className="seccion">
          <div className="contenedor">
            <h2>Un servidor armado alrededor del agite</h2>
            <dl className="reglas">
              <div>
                <dt>Subir de nivel es la parte corta</dt>
                <dd>
                  La experiencia es rápida a propósito. Cada tramo tiene su muñeco de entrenamiento y el nivel máximo
                  es <b>45</b>, así que el tiempo se va en pelear y no en matar bichos.
                </dd>
              </div>
              <div>
                <dt>El oro no se usa</dt>
                <dd>
                  Lo que vale se gana jugando: <b>Puntos de Canje</b> en torneos, eventos y misiones, y{" "}
                  <b>Puntos de Reto</b> en los duelos rápidos. Con eso se canjean las armas, armaduras y túnicas.
                </dd>
              </div>
              <div>
                <dt>Siempre hay un duelo disponible</dt>
                <dd>
                  Escribís <code>/RETAR</code> y elegís rival y apuesta: por canjes, por items o por Elo. Si no querés
                  esperar, en la Sala de TP hay 12 salas de 1 contra 1 y 8 de 2 contra 2 que arrancan cuando se pisan
                  las baldosas.
                </dd>
              </div>
              <div>
                <dt>Torneos que se arman solos</dt>
                <dd>
                  Te anotás con <code>/PARTICIPAR</code> y el servidor arma la llave: de 1 contra 1 a 4 contra 4, hasta
                  64 participantes y 16 duelos a la vez.
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="seccion seccion-cuero" id="eventos">
          <div className="contenedor">
            <h2>Cada 15 minutos empieza un evento</h2>
            <p className="entrada">
              Los abre el servidor, sin esperar a un GM. Avisa por el chat general 5 minutos y 1 minuto antes, y te
              anotás con <code>/PARTICIPAR</code>.
            </p>
            <ol className="ciclo">
              {ciclo.map((c) => (
                <li key={c.evento}>
                  <strong>{c.evento}</strong>
                  <span>Mínimo: {c.minimo}</span>
                </li>
              ))}
            </ol>
            <p className="nota">
              Cuando termina la lista vuelve a empezar, y esa segunda vuelta se juega con los items de canje
              bloqueados, para pelear con lo básico. El ciclo completo dura 3 horas y media.{" "}
              <Link href="/wiki#eventos">Reglas y premios de cada evento</Link>
            </p>
          </div>
        </section>

        <section className="seccion">
          <div className="contenedor">
            <h2>El Elo dice quién es quién</h2>
            <p className="entrada">
              Ganar un duelo por Elo suma <b>5 puntos</b> y perderlo resta 5; con tres seguidos, 6. Ganar un torneo
              suma 10. Tu liga se ve sobre el personaje como aura y emblema, y los diez mejores llevan una propia.
            </p>
            <ol className="ligas">
              {ligas.map((l) => (
                <li key={l.nombre} className={l.clase}>
                  <strong>{l.nombre}</strong>
                  <span>{l.elo}</span>
                </li>
              ))}
            </ol>
            <p className="nota">
              Cada liga tiene cuatro rangos, del 4 al 1. <Link href="/wiki#elo">Cómo funciona el Elo</Link>
            </p>
          </div>
        </section>

        <section className="seccion seccion-cuero" id="donar">
          <div className="contenedor">
            <h2>Tres monedas, ninguna es oro</h2>
            <div className="monedas">
              <div>
                <h3>Puntos de Canje</h3>
                <p>
                  La moneda principal. Salen de torneos, eventos, misiones y del ranking semanal, y se cambian por el
                  equipo más fuerte del juego. Se pueden transferir entre jugadores.
                </p>
              </div>
              <div>
                <h3>Puntos de Reto</h3>
                <p>
                  Uno por cada reto rápido ganado en la Sala de TP. Se gastan en un catálogo propio de túnicas y no se
                  transfieren.
                </p>
              </div>
              <div>
                <h3>Trhynum Points</h3>
                <p>
                  Para skins, la tienda y los cofres. Se consiguen dentro del juego: hablás con el NPC de Donación,
                  elegís el monto y pagás con el QR de Mercado Pago. La web ya no vende puntos.{" "}
                  <Link href="/wiki#tp">Precios y catálogo</Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="seccion" id="capturas">
          <div className="contenedor">
            <h2>Así se ve adentro</h2>
            <Galeria capturas={capturas} />
            <Trailer id={enlaces.trailer} />
          </div>
        </section>

        <section className="seccion seccion-cuero" id="descargas">
          <div className="contenedor">
            <h2>Descargá el juego</h2>
            <div className="descarga">
              <div>
                {descarga.directa ? (
                  <div className="acciones">
                    <a className="boton boton-principal" href={descarga.directa}>
                      Descargar el instalador {descarga.peso && <small>{descarga.peso}</small>}
                    </a>
                    {descarga.espejo && (
                      <a className="boton" href={descarga.espejo} target="_blank" rel="noopener noreferrer">
                        Enlace alternativo
                      </a>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="entrada">
                      Estamos preparando el instalador de la versión nueva. Lo publicamos acá y avisamos por Discord
                      apenas esté.
                    </p>
                    <div className="acciones" style={{ marginTop: 22 }}>
                      <a className="boton boton-principal" href={enlaces.discord} target="_blank" rel="noopener noreferrer">
                        Entrar al Discord
                      </a>
                    </div>
                  </>
                )}
                {descarga.directa && (
                  <ol className="pasos">
                    <li>Ejecutá el instalador. Si Windows pregunta, permitilo: es un programa sin firma.</li>
                    <li>Abrí TrhynumAO y creá tu cuenta desde la pantalla de inicio.</li>
                    <li>Elegí raza y clase, y entrá. El primer muñeco de entrenamiento está en el Dungeon Newbie.</li>
                  </ol>
                )}
                <p className="nota">
                  ¿Algo no arranca? Probá ejecutarlo como administrador o escribinos por{" "}
                  <a href={enlaces.discord} target="_blank" rel="noopener noreferrer">
                    Discord
                  </a>
                  .
                </p>
              </div>
              <dl className="requisitos">
                {requisitos.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="seccion" id="staff">
          <div className="contenedor">
            <h2>Quiénes lo hacemos</h2>
            <ul className="staff">
              {staff.map((s) => (
                <li key={s.nick}>
                  <strong>
                    {s.nick}
                    <small>{s.nombre}</small>
                  </strong>
                  <span>{s.rol}</span>
                </li>
              ))}
            </ul>
            <p className="nota">
              Para dudas dentro del juego usá <code>/SOPORTE</code>: el mensaje queda guardado y lo responde un GM.
            </p>
          </div>
        </section>
      </main>

      <Pie />
    </>
  )
}
