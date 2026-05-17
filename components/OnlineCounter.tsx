import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

/**
 * Componente de Servidor para mostrar los usuarios online.
 * Se puede usar directamente en cualquier página de Next.js (App Router).
 */
export default async function OnlineCounter() {
  // Obtenemos el dato directamente desde KV en el servidor
  let onlines: number | null = 0;
  
  try {
    onlines = await redis.get<number>('onlines_count');
  } catch (error) {
    console.error("Error loading online users:", error);
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 w-fit">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
      <span className="text-sm font-medium text-white/90">
        Jugadores Online: <span className="text-green-400 font-bold">{onlines ?? 0}</span>
      </span>
    </div>
  );
}
