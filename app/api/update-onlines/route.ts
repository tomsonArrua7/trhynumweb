import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export const runtime = 'edge';

export async function POST(request: Request) {
  let rawBody = "";
  try {
    rawBody = await request.text();
    const body = JSON.parse(rawBody);
    const { secret, onlines } = body;

    // Log para depuración
    console.log("Recibida petición de actualización:", { hasSecret: !!secret, onlines });

    // 1. Validar el secreto de autenticación
    if (!secret || secret !== process.env.AUTH_SECRET) {
      console.error("Fallo de autenticación. Secreto recibido:", secret);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validar que 'onlines' sea un número
    const onlineCount = parseInt(onlines);
    if (isNaN(onlineCount)) {
      console.error("Error: 'onlines' no es un número válido:", onlines);
      return NextResponse.json({ error: 'Invalid onlines count' }, { status: 400 });
    }

    // 3. Guardar en Upstash Redis
    await redis.set('onlines_count', onlineCount);
    await redis.set('last_online_update', Date.now());
    console.log("Actualización exitosa. Usuarios online:", onlineCount);

    return NextResponse.json({ success: true, updated: onlineCount }, { status: 200 });
  } catch (error) {
    console.error('Error al procesar la petición POST:', error);
    console.error('Cuerpo recibido (Raw Body):', rawBody);
    return NextResponse.json({ 
      error: 'Invalid JSON format', 
      details: error instanceof Error ? error.message : "Unknown error",
      received: rawBody 
    }, { status: 400 });
  }
}
