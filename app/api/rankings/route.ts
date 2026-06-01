import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const mockRankings: Record<string, any[]> = {
  // Categoría 1: 1v1 Retos
  "1": [
    { posicion: 1, nombre: "Goku", puntos: 2840 },
    { posicion: 2, nombre: "NullPointer", puntos: 2610 },
    { posicion: 3, nombre: "Zeus", puntos: 2550 },
    { posicion: 4, nombre: "Kratos", puntos: 2390 },
    { posicion: 5, nombre: "Legolas", puntos: 2200 },
    { posicion: 6, nombre: "Arthas", puntos: 2150 },
    { posicion: 7, nombre: "Sauron", puntos: 2010 },
    { posicion: 8, nombre: "Gandalf", puntos: 1980 },
    { posicion: 9, nombre: "Lagertha", puntos: 1850 },
    { posicion: 10, nombre: "Ragnar", puntos: 1790 }
  ],
  // Categoría 2: 2v2 Retos
  "2": [
    { posicion: 1, nombre: "Goku & Vegeta", puntos: 1450 },
    { posicion: 2, nombre: "Legolas & Gimli", puntos: 1320 },
    { posicion: 3, nombre: "Arthas & Jaina", puntos: 1290 },
    { posicion: 4, nombre: "Ragnar & Floki", puntos: 1100 },
    { posicion: 5, nombre: "Neo & Trinity", puntos: 1020 }
  ],
  // Categoría 3: Castillos (El puntaje es tiempo en segundos)
  "3": [
    { posicion: 1, nombre: "Imperio del Mal (Dueño de Ullathorpe)", puntos: 18000 },
    { posicion: 2, nombre: "Orden Sagrada (Dueño de Banderbill)", puntos: 10800 },
    { posicion: 3, nombre: "Mercenarios (Retador Activo)", puntos: 3600 }
  ],
  // Categoría 4: Torneos
  "4": [
    { posicion: 1, nombre: "Zeus", puntos: 14 },
    { posicion: 2, nombre: "Goku", puntos: 12 },
    { posicion: 3, nombre: "Kratos", puntos: 9 }
  ],
  // Categoría 5: CvC Clanes
  "5": [
    { posicion: 1, nombre: "VALHALLA", puntos: 48500 },
    { posicion: 2, nombre: "SYNDICATE", puntos: 39100 },
    { posicion: 3, nombre: "ODIN", puntos: 35000 },
    { posicion: 4, nombre: "NIGHTFALL", puntos: 28900 },
    { posicion: 5, nombre: "LEGION", puntos: 24200 }
  ],
  // Categoría 6: Top 10 ELO Clasificatorio (Muestra ELO numérico y activa badges de ligas)
  "6": [
    { posicion: 1, nombre: "JEJO", puntos: 2450 },       // Maestro (>= 2000)
    { posicion: 2, nombre: "seLfish", puntos: 2120 },    // Maestro (>= 2000)
    { posicion: 3, nombre: "PRUEBA", puntos: 1950 },     // Platino (1800-1999)
    { posicion: 4, nombre: "Chesterfield", puntos: 1840 },// Platino (1800-1999)
    { posicion: 5, nombre: "Trolitax", puntos: 1650 },    // Oro (1500-1799)
    { posicion: 6, nombre: "Setsuna", puntos: 1540 },     // Oro (1500-1799)
    { posicion: 7, nombre: "Makelele", puntos: 1420 },    // Plata (1200-1499)
    { posicion: 8, nombre: "Sunra", puntos: 1350 },       // Plata (1200-1499)
    { posicion: 9, nombre: "Zunny", puntos: 1180 },       // Bronce (< 1200)
    { posicion: 10, nombre: "Miquela", puntos: 1100 }     // Bronce (< 1200)
  ]
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "1";

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

    // Inicialización perezosa (lazy load) para evitar crasheos en build-time
    if (redisUrl && redisToken && redisUrl.startsWith("https")) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken });
        const cachedRankings = await redis.get(`rankings_${category}`);
        if (cachedRankings) {
          return NextResponse.json({ success: true, data: cachedRankings });
        }
      } catch (redisErr) {
        console.error("Error al consultar Upstash Redis (Rankings):", redisErr);
      }
    }

    // Retornar datos mock adaptados en español para que la UI se dibuje sin errores
    const data = mockRankings[category] || mockRankings["1"];
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in rankings API:", error);
    // Retornar datos mock de salvaguarda en español
    const category = new URL(req.url).searchParams.get("category") || "1";
    const data = mockRankings[category] || mockRankings["1"];
    return NextResponse.json({ success: true, data });
  }
}
