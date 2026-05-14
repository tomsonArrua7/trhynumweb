import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Asegura que no se cachee el resultado

export async function GET() {
  try {
    const onlines = await kv.get<number>('onlines_count');
    return NextResponse.json({ onlines: onlines ?? 0 });
  } catch (error) {
    console.error('Error fetching online count:', error);
    return NextResponse.json({ onlines: 0, error: 'Failed to fetch' }, { status: 500 });
  }
}
