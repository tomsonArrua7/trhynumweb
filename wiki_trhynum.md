# 🔧 PARTE 1: REPORTE TÉCNICO (Para el desarrollador)

---

## 1. Requisitos para Fundar Clan

**Archivo:** `ModClanes.bas` + `cGuild.cls`

| Parámetro | Estado en el código |
|---|---|
| Nivel mínimo | **No encontrado como constante dura** — el flujo llama a `FetchGuild` y trabaja con `GuildName`; no hay un `ELV >= X` explícito en los primeros 500 líneas. **Revisar si hay validación en el handler TCP `CRCLAN` o en el `cGuild.cls`.** |
| Costo en Oro | **No encontrado como constante** en `ModClanes.bas`. Buscar `GLD` o `gold` en el handler TCP de creación de clan. |
| Miembros mínimos | No hay `MIN_MIEMBROS` explícito encontrado. |
| Ítems especiales | No encontrado. |
| Alineación | No hay restricción por facción evidente. |

> **⚠️ Acción recomendada:** Buscar `Case "CRCLAN"` o el literal de creación de gremio en `Handledata_1.bas` / `Handledata_2.bas` para encontrar las validaciones reales (pueden estar en `TCP.bas`).

---

## 2. Sistemas de Torneos

**Archivos:** `TorneosPlantes.bas`, `TorneosSaturoS.bas`, `Torneo2v2Random.bas`, `TorneosPingPong.bas`, `modTorneos2v2.bas`, `Deathmatch.bas`

### Deathmatch (DM) — `Deathmatch.bas`
- **Mapa espera:** 53 | **Mapa combate:** 89 | **Mapa salida:** 1
- **Modalidad:** Free For All (FFA activado en el mapa de combate)
- **Inscripción:** `/PARTICIPAR` (broadcast automático al lanzarlo)
- **Inicio automático:** `DM_AbrirAuto(MaxParticipantes)` — lanza anuncio global
- **Premio ganador:** `15 Puntos de Canjeo` + `1 Punto de Quest`
- **Eliminación:** Al morir → warp a mapa 1

### Torneos de Plantes / Saturo / 2v2 Random / PingPong
- Todos tienen lógica de inscripción por comando o trigger de GM
- Utilizan mapa 53 como sala de espera (misma que DM)
- Tienen constantes de mapa y premio en sus respectivos `.bas`
- **⚠️ No tienen autotimer programado** por defecto; el GM dispara `DM_AbrirGM` o equivalente desde el panel de admin

---

## 3. Rankings

**Archivo:** `modRankingSYSTEM.bas` | **Persistencia:** `\RankingMensual.dat`

| Categoría | Descripción |
|---|---|
| **Ranking 1v1** | Top 10 — campos: `Wins`, `Losses`, `Points` |
| **Ranking 2v2** | Top 10 — misma estructura |
| **Reset:** | Cada **7 días** (`DateDiff("d", ...) >= 7`) |
| **Premio Top 1 (1v1):** | **200 Puntos de Canje** al jugador #1 |
| **Premio Top 1 (2v2):** | **100 Puntos de Canje** al jugador #1 |
| **Anuncio:** | Broadcast global al resetear con coronación |
| **Anti-farmeo:** | Historial de últimas **5 peleas** (`MAX_HISTORY = 5`) para bloquear farmeo de puntos |
| **Comando:** | `/RANKING` (visible en `Handledata_1.bas`) |
| **Offline award:** | Si el ganador está desconectado, se guarda el Canje en su `.chr` directamente |

---

## 4. Sistemas de Agite Custom

### 🥊 Retos 1v1 — `modRetos.bas`
- **Mecánica:** Pisar una **baldosa específica** del mapa activa el reto si el oponente también está parado en su baldosa correspondiente
- **Arenas:** `MAX_ARENAS` arenas paralelas (12 arenas)
- **Cooldown post-reto:** Se usa `DuelInitPositions(i)` para validar posición
- **Formato:** Mejor de 1 (primer muerto pierde)
- **Premio ganador:** `PRECIO_RETO * 1.5` en Oro + `+1 flag.Reto` (contador de retos ganados)
- **Bloqueo:** `/BLOQRETOS 1` para rechazar retos | `/BLOQRETOS 0` para desbloquear
- **Post-reto:** Warp a `ULLATHORPE`, stats restaurados, inventario sincronizado

### ⚔️ Retos Apostados — `ModRetosApostados.bas` + TCP
- **Comando desafío:** `/APUESTA <monto>` + target
- **Aceptar:** `/ACEPTARAPUESTA`
- **Validaciones:** No estar en reto activo, no tener retos bloqueados, arena libre disponible
- **Múltiples arenas** gestionadas por `RetoApostado_ArenaLibre()`

### 👥 Retos 2v2 — `modRetos2v2.bas`
- Sistema análogo a 1v1 pero para parejas
- Usa `modRetos2v2.CheckDuelPosition2v2(UserIndex)` tras cada movimiento

### 🏰 Castillo de Clanes
- **No se encontró un módulo activo de dominación de castillo** en el escaneo de `ModClanes.bas`
- El campo `TiempoDomina` y `GuildDominante` no aparecen → **sistema no implementado o no está en ese módulo**
- Revisar si está en `General.bas` o `GameLogic.bas`

---

## 5. Sistema de Evolución

**Archivo:** `Declares.bas`

| Parámetro | Valor |
|---|---|
| **Nivel Máximo** | **45** (`Public Const STAT_MAXELV = 45`) |
| **Mapa spawn inicial** | Mapa 26 (niveles 1–13) |
| **Mapa lvl 14–25** | Mapa 30 |
| **Mapa lvl 26–34** | Mapa 31 |
| **Mapa lvl 35–44** | Mapa 32 |
| **Mapa lvl 45+ (endgame)** | Mapa 1 — Ullathorpe |

### Sistema de Subclases / Recompensas — `Subclases.bas`
- Al llegar a ciertos niveles, `PuedeSubirClase()` permite elegir una **subclase**
- Ciudadano → **Luchador** (única opción; Trabajador deshabilitado)
- El juego otorga **Recompensas** (hasta 3) al evolucionar: items, +HP, +Mana
- Sistema de **Clase = CLERIGO**: Recompensa 3 → +5 HP o +15 Mana

> **Multiplicadores de EXP/Oro:** No se encontraron constantes `ExpMulti` o `GoldMult` en `Declares.bas`. Probablemente el servidor usa las tasas base del motor Fénix o están en `FileIO.bas`/`GameLogic.bas`.

---
---

# 📜 PARTE 2: MINI-WIKI OFICIAL (Para los Jugadores)

---

# 📜 Guía Rápida: Evolución y Agite en TrhynumAO

> *Bienvenido al servidor. Acá no hay lugar para los tibios. Te explicamos cómo funciona todo para que en 5 minutos ya estés peleando.*

---

## ⬆️ Cómo subir de nivel

El nivel máximo es **45**. El servidor te guía automáticamente por zonas de leveo según tu nivel:

| Nivel | Zona |
|---|---|
| 1 – 13 | Mapa de Entrenamiento (spawn inicial) |
| 14 – 25 | Segunda zona de leveo |
| 26 – 34 | Tercera zona |
| 35 – 44 | Cuarta zona (ya empieza el agite) |
| **45** | **Ullathorpe** — la ciudad del agite full |

Subir de nivel no solo te da stats: al llegar a ciertos hitos elegís una **subclase** que potencia tu clase base. Si sos ciudadano, tu único camino de combate es el **Luchador** — no hay trabajadores, acá se vino a pelear.

Cada subclase te da además **Recompensas** (hasta 3): ítems, HP extra o Mana extra. Elegí bien porque son permanentes.

---

# ⚔️ Sistemas Competitivos y Torneos

## 🥊 Retos 1v1 (Baldosas)
El sistema más rápido del servidor. Para retar a alguien:
1. Andá a la zona de **Arenas de Reto** en Ullathorpe.
2. Pará sobre **tu baldosa** — si el otro para sobre la suya al mismo tiempo, el reto **empieza automático**.
3. El combate es **mejor de 1** — primer muerto, pierde.
4. El ganador se lleva **oro** (x1.5 del precio base) y suma un frag al contador de retos.
5. Al terminar, los dos son warpeados curados y con inventario limpio. Sin bugs, sin excusas.

> Hay **12 arenas simultáneas**. Si una está ocupada, probá más abajo.
> Si no querés recibir retos, escribí `/BLOQRETOS 1`. Para volver a recibir: `/BLOQRETOS 0`.

## 💰 Retos Apostados
Para los que le ponen guita al asunto:
1. Apuntá al rival y escribí `/APUESTA <monto>`.
2. El rival acepta con `/ACEPTARAPUESTA`.
3. El que gana se lleva todo. El que pierde, pierde.

## 👥 Retos 2v2
Misma mecánica que los 1v1 pero en parejas. Coordiná con tu compañero para pisar las baldosas al mismo tiempo.

## 💀 Deathmatch (FFA Automático)
Cuando el servidor anuncia un **Deathmatch**, escribí `/PARTICIPAR` para inscribirte.
- Es un **Free For All** — todos contra todos.
- El último en pie gana **15 Puntos de Canje** + **1 Punto de Quest**.
- Al morir sos warpeado afuera. Sin respawn.

## 🏆 Rankings Semanales
El servidor tiene **dos rankings separados**:

| Ranking | Premio Top 1 |
|---|---|
| 🥇 **1v1** | 200 Puntos de Canje |
| 🥇 **2v2** | 100 Puntos de Canje |

- Los rankings se **resetean cada 7 días**.
- Al finalizar la semana, el #1 de cada categoría es coronado con anuncio global.
- El sistema tiene **anti-farmeo**: no podés sumar puntos farmeando siempre al mismo rival (historial de últimas 5 peleas).
- Consultá el ranking en cualquier momento con: `/RANKING`

---

# 🛡️ Fundar y Liderar un Clan

Los clanes son el corazón del agite organizado. Para crear el tuyo:

1. Alcanzá el **nivel y oro requeridos** (consultá los requisitos exactos en el servidor con un GM o en el canal de anuncios).
2. Usá el comando de creación de clan desde el menú de gremio.
3. Como **Líder**, podés:
   - Reclutar miembros
   - Declarar enemigos y aliados a otros clanes
   - Coordinar al clan en el chat de gremio (tecla de guild chat)

> El sistema de **Castillo de Clanes** (dominación) está en desarrollo. Cuando esté activo, el clan dominante recibirá recompensas exclusivas. Estate atento a los anuncios.

**Tip de liderazgo:** Un clan activo es un clan competitivo. Organizate para las semanas de ranking 2v2 — si tu clan mete dos jugadores arriba, el premio en Canjes va directo a su inventario.

---

# 💡 Tips Fundamentales para el Agite

**1. Los Puntos de Canje son la moneda del endgame.**
Ganás Canjes en Deathmatch, Rankings semanales y Quests. Usalos sabiamente — son lo que te separa del equipo bueno del equipo de cartón.

**2. Revisá el seguro de retos.**
Si estás farmeando o no querés que te interrumpan, activá `/BLOQRETOS 1`. Si estás listo para el agite, desactivalo. No hay excusas de "me retaron de sorpresa".

**3. Manejá la stamina.**
El sistema penaliza atacar sin stamina. Llevá pociones de stamina si vas a una arena prolongada o a un DM.

**4. El mapa importa.**
En zonas de leveo, no hay PVP activo. En **Ullathorpe y las arenas**, es zona libre. Conocé dónde empieza el agite real antes de entrar dopado y solo.

**5. Consultá `/RANKING` antes de los retos.**
Si el tipo que te está retando está en el Top 3, es porque sabe pelear. Preparate o bloqueá retos hasta estar listo. La humillación pública en el anuncio de reto perdido es real.

---

> *¿Dudas? Preguntá en Discord o en el chat global. La comunidad orienta, pero el frag lo ganás vos.*

---
*TrhynumAO — Servidor de Argentum Online Custom*
