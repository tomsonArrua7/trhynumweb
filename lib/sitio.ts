// Datos del sitio en un solo lugar: enlaces, descargas, capturas y staff.
// Para cambiar una captura o un enlace alcanza con tocar este archivo.

export const enlaces = {
  discord: "https://discord.gg/eS7eeDeSGT",
  instagram: "https://www.instagram.com/trhynumao",
  whatsapp: "https://wa.me/542215016468",
  trailer: "-13-ApdmUk4",
}

// Instalador del juego. `directa` baja el .exe sin pasar por otra pagina; `mediafire` es el espejo.
// Si los dos estan vacios la web avisa que el instalador esta en preparacion.
export const descarga: { directa: string; mediafire: string; peso: string } = {
  directa: "",
  mediafire: "https://www.mediafire.com/file/ql0ay0q51e63zvs/TrhynumAO_2.0_Instalador.exe/file",
  peso: "47 MB",
}

export const requisitos: [string, string][] = [
  ["Sistema", "Windows 7, 8, 10 u 11"],
  ["Procesador", "Intel Core i3 o superior"],
  ["Memoria", "4 GB"],
  ["Disco", "200 MB libres"],
  ["Gráficos", "DirectX 8 o superior"],
]

export type Captura = { src: string; alt: string }

// Las capturas viven en public/assets/capturas (1024x768, en .webp).
export const capturaPortada: Captura = {
  src: "/assets/capturas/portada.webp",
  alt: "La plaza de Ullathorpe con el Sastre de Skins, Tyrion y el Forjador Arcano",
}

export const capturas: Captura[] = [
  { src: "/assets/capturas/ullathorpe-plaza.webp", alt: "Portales a la Zona de Agite y a los teleports en Ullathorpe" },
  { src: "/assets/capturas/tienda-de-magia.webp", alt: "La tienda de hechizos e items de Ullathorpe" },
  { src: "/assets/capturas/rango.webp", alt: "Ventana de rango: liga Oro 3 y el resto de las ligas" },
  { src: "/assets/capturas/tiempos.webp", alt: "Ventana de tiempos: próximos eventos y jefes de dungeon" },
  { src: "/assets/capturas/skins.webp", alt: "Sastre de Skins: variantes Sombría, Dorada y Glacial de un arco" },
  { src: "/assets/capturas/forjador.webp", alt: "Forjador Arcano: fragmentos, gemas y mejora de armas" },
  { src: "/assets/capturas/tienda.webp", alt: "Tienda de Trhynum Points con kits y cofres" },
  { src: "/assets/capturas/sala-de-retos.webp", alt: "Sala de retos: baldosas de 1 contra 1 y 2 contra 2, y portales a los dungeons" },
  { src: "/assets/capturas/opciones.webp", alt: "Opciones del juego: cada ayuda visual se prende o se apaga" },
]

// El primero es el director y se muestra en grande.
export const staff: { nick: string; nombre: string; cargo: string; tarea: string }[] = [
  { nick: "Benedict", nombre: "Tomás", cargo: "Director del proyecto", tarea: "Fundador y desarrollador principal" },
  { nick: "NidwaZ", nombre: "Tobías", cargo: "Co-Director del proyecto", tarea: "Dirección del juego junto a Benedict" },
  { nick: "rAzer", nombre: "Tom", cargo: "Programador de Discord", tarea: "Bot y comunidad de Discord" },
]

// Ciclo de eventos automaticos del servidor (uno cada 15 minutos).
export const ciclo: { evento: string; minimo: string }[] = [
  { evento: "Torneo 1 contra 1", minimo: "4 jugadores" },
  { evento: "Ping-Pong 3 contra 3", minimo: "6 jugadores" },
  { evento: "Captura de bandera", minimo: "2 por bando" },
  { evento: "Torneo 2 contra 2 al azar", minimo: "6 jugadores" },
  { evento: "Evento Kills", minimo: "2 por bando" },
  { evento: "Torneo 3 contra 3 al azar", minimo: "9 jugadores" },
  { evento: "Torneo 2 contra 2 con party", minimo: "8 jugadores" },
]

export const ligas: { nombre: string; elo: string; clase: string }[] = [
  { nombre: "Bronce", elo: "0 a 450", clase: "bronce" },
  { nombre: "Plata", elo: "451 a 850", clase: "plata" },
  { nombre: "Oro", elo: "851 a 1250", clase: "oro" },
  { nombre: "Platino", elo: "1251 a 1650", clase: "platino" },
  { nombre: "Maestro", elo: "1651 o más", clase: "maestro" },
]
