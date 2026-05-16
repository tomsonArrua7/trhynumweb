import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const onlines = await redis.get<number>('onlines_count');
    return NextResponse.json({ onlines: onlines ?? 0 });
  } catch (error) {
    console.error('Error fetching online count:', error);
    return NextResponse.json({ onlines: 0, error: 'Failed to fetch' }, { status: 500 });
  }
}
