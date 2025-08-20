import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

export async function GET() {
  try {
    const results = [];

    // 1. Probar SIN location (automático)
    try {
      console.log('🔍 Probando SIN location especificado...');

      const vertex_ai_auto = new VertexAI({
        project: process.env.GOOGLE_PROJECT_ID!,
        // Sin location
      });

      const model = vertex_ai_auto.preview.getGenerativeModel({
        model: 'text-bison',
      });

      const result = await model.generateContent('Responde: OK');
      const response =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text;

      results.push({
        location: 'auto (sin especificar)',
        status: 'success',
        response: response || 'Sin respuesta',
        note: 'Funciona sin location ✅',
      });
    } catch (error) {
      results.push({
        location: 'auto (sin especificar)',
        status: 'error',
        error:
          error instanceof Error
            ? error.message.substring(0, 100)
            : 'Error desconocido',
      });
    }

    // 2. Probar diferentes locations
    const locationsToTest = [
      'us-central1',
      'us-east1',
      'us-west1',
      'europe-west4',
      'asia-southeast1',
    ];

    for (const location of locationsToTest) {
      try {
        console.log(`🌍 Probando location: ${location}`);

        const vertex_ai = new VertexAI({
          project: process.env.GOOGLE_PROJECT_ID!,
          location: location,
        });

        const model = vertex_ai.preview.getGenerativeModel({
          model: 'text-bison',
        });

        const result = await model.generateContent('Responde: OK');
        const response =
          result.response.candidates?.[0]?.content?.parts?.[0]?.text;

        results.push({
          location: location,
          status: 'success',
          response: response || 'Sin respuesta',
          note: 'Location funciona ✅',
        });
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Error desconocido';
        results.push({
          location: location,
          status: 'error',
          error: errorMsg.includes('404')
            ? 'Modelos no disponibles en esta región'
            : errorMsg.substring(0, 100),
        });
      }
    }

    const workingLocations = results.filter((r) => r.status === 'success');

    return NextResponse.json({
      message: 'Prueba de locations para Vertex AI',
      timestamp: new Date().toISOString(),
      user: 'erikavent',
      project: process.env.GOOGLE_PROJECT_ID,
      summary: {
        totalTested: results.length,
        working: workingLocations.length,
        bestOption: workingLocations[0]?.location || 'Ninguno funciona',
        autoLocationWorks: results[0]?.status === 'success',
      },
      results,
      recommendation:
        workingLocations.length > 0
          ? `Usar location: ${workingLocations[0].location}`
          : 'Ningún location funciona - considerar OpenAI',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al probar locations',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
