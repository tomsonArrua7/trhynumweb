// Datos del sitio en un solo lugar: enlaces, descargas, capturas y staff.
// Para cambiar una captura o un enlace alcanza con tocar este archivo.

export const enlaces = {
  discord: "https://discord.gg/eS7eeDeSGT",
  instagram: "https://www.instagram.com/trhynumao",
  whatsapp: "https://wa.me/542215016468",
  trailer: "-13-ApdmUk4",
}

export const descarga = {
  directa: "/downloads/Instalador_TrhynumAO.exe",
  mediafire: "https://www.mediafire.com/file/uzt5yvf7hgblrwl/Instalador_TrhynumAO.exe/file",
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

export const capturaPortada: Captura = {
  src: "/assets/Screenshot_01062026_220128.webp",
  alt: "Ullathorpe llena de jugadores antes de un evento",
}

export const capturas: Captura[] = [
  { src: "/assets/Screenshot_01062026_220203.webp", alt: "Jugadores reunidos en Ullathorpe" },
  { src: "/assets/Screenshot_01062026_220217.webp", alt: "Captura del juego" },
  { src: "/assets/Screenshot_01062026_233306.webp", alt: "Captura del juego" },
  { src: "/assets/Screenshot_01062026_212710.webp", alt: "Captura del juego" },
  { src: "/assets/Screenshot_01062026_214553.webp", alt: "Captura del juego" },
  { src: "/assets/Screenshot_01062026_215924.webp", alt: "Captura del juego" },
  { src: "/assets/image1.webp", alt: "Captura del juego" },
  { src: "/assets/image3.webp", alt: "Captura del juego" },
  { src: "/assets/foto4.webp", alt: "Captura del juego" },
]

export const staff: { nick: string; nombre: string; rol: string }[] = [
  { nick: "Benedict", nombre: "Tomás", rol: "Fundador y desarrollador principal" },
  { nick: "rAzer", nombre: "Tom", rol: "Director y programador de Discord" },
  { nick: "Ameelye", nombre: "Joaquín", rol: "Mapeador y diseño del continente" },
  { nick: "turkheN", nombre: "Juani", rol: "Eventos en vivo y soporte" },
  { nick: "Bynereo", nombre: "Nicolás", rol: "Eventos en vivo y soporte" },
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
