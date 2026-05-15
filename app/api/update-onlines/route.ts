import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

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

    // 3. Guardar en Vercel KV
    await kv.set('onlines_count', onlineCount);
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
