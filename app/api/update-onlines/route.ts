import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { secret, onlines } = body;

    // 1. Validar el secreto de autenticación
    if (!secret || secret !== process.env.AUTH_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validar que 'onlines' sea un número
    const onlineCount = parseInt(onlines);
    if (isNaN(onlineCount)) {
      return NextResponse.json({ error: 'Invalid onlines count' }, { status: 400 });
    }

    // 3. Guardar en Vercel KV
    await kv.set('onlines_count', onlineCount);

    return NextResponse.json({ success: true, updated: onlineCount }, { status: 200 });
  } catch (error) {
    console.error('Error updating online count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
