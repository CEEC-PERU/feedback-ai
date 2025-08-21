import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

export async function GET() {
  try {
    const vertex_ai = new VertexAI({
      project: process.env.GOOGLE_PROJECT_ID!,
      location: 'europe-west3',
    });

    // Probar diferentes modelos
    const modelsToTest = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
      'gemini-pro',
    ];

    const results = [];

    for (const modelName of modelsToTest) {
      try {
        const model = vertex_ai.preview.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent('Hola, responde con "OK"');
        results.push({
          model: modelName,
          status: 'success',
          response:
            result.response.candidates?.[0]?.content?.parts?.[0]?.text ||
            'Sin respuesta',
        });
      } catch (error) {
        results.push({
          model: modelName,
          status: 'error',
          error: error instanceof Error ? error.message : 'Error desconocido',
        });
      }
    }

    return NextResponse.json({
      message: 'Prueba de modelos Gemini',
      project: process.env.GOOGLE_PROJECT_ID,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al probar modelos',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
