import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  try {
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    let onlines = 0;

    if (redisUrl && redisToken && redisUrl.startsWith("https")) {
      try {
        const redis = new Redis({ url: redisUrl, token: redisToken });
        const count = await redis.get<number>('onlines_count');
        onlines = count ?? 0;
      } catch (redisErr) {
        console.error('Error fetching online count from Redis:', redisErr);
      }
    }

    return NextResponse.json({ onlines });
  } catch (error) {
    console.error('Error fetching online count:', error);
    return NextResponse.json({ onlines: 0, error: 'Failed to fetch' }, { status: 500 });
  }
}
