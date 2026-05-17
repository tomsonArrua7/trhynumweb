import { Redis } from '@upstash/redis';
import { NextResponse } from "next/server"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const runtime = 'edge';

export async function GET() {
  try {
    let onlines = 0
    let isOnline = false
    try {
      const kvValue = await redis.get<number>('onlines_count')
      onlines = kvValue !== null ? Number(kvValue) : 0
      // Simplification for Cloudflare: if there are players, it's online.
      // Or we just assume it's online if we can connect to Redis.
      isOnline = onlines >= 0 
    } catch (kvError) {
      console.error("Error al acceder a Upstash Redis:", kvError)
    }
    
    return NextResponse.json(
      { online: isOnline, onlines: onlines },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      }
    );
  } catch (error) {
    console.error("Error crítico en API Status:", error)
    return NextResponse.json({ 
      online: false, 
      onlines: 0,
      error: "Internal check failed"
    }, { status: 500 })
  }
}
