import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    console.log('Generando audio para texto:', text.substring(0, 100) + '...');

    // Simular generación de audio con Web Speech API del lado del cliente
    // Por ahora retornamos los datos para que el frontend maneje el audio

    const audioData = {
      success: true,
      textToSpeak: text,
      message: 'Audio preparado para síntesis',
      timestamp: new Date().toISOString(),
      length: text.length,
    };

    return NextResponse.json(audioData);
  } catch (error) {
    console.error('Error en text-to-speech:', error);
    return NextResponse.json(
      {
        error: 'Error al generar audio',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
