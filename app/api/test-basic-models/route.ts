import { NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';

export async function GET() {
  try {
    const vertex_ai = new VertexAI({
      project: process.env.GOOGLE_PROJECT_ID!,
      location: 'us-central1',
    });

    // Modelos básicos más comunes en Vertex AI
    const basicModels = [
      'text-bison',
      'text-bison@001',
      'text-bison@002',
      'chat-bison',
      'chat-bison@001',
      'chat-bison@002',
    ];

    const results = [];
    let workingModel = null;

    for (const modelName of basicModels) {
      try {
        console.log(`🔍 Probando modelo: ${modelName}`);

        const model = vertex_ai.preview.getGenerativeModel({
          model: modelName,
        });

        // Prueba simple
        const result = await model.generateContent('Responde solo con: OK');
        const responseText =
          result.response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (responseText) {
          results.push({
            model: modelName,
            status: 'success',
            response: responseText.trim(),
            note: 'Modelo disponible ✅',
          });

          if (!workingModel) {
            workingModel = modelName;
          }
        } else {
          results.push({
            model: modelName,
            status: 'no-response',
            response: 'Sin respuesta del modelo',
          });
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Error desconocido';
        results.push({
          model: modelName,
          status: 'error',
          error: errorMsg.includes('404')
            ? 'Modelo no encontrado (404)'
            : errorMsg.substring(0, 100),
        });
      }
    }

    const successfulModels = results.filter((r) => r.status === 'success');

    return NextResponse.json({
      message: 'Prueba de modelos básicos de Vertex AI',
      timestamp: new Date().toISOString(),
      project: process.env.GOOGLE_PROJECT_ID,
      location: 'us-central1',
      summary: {
        totalTested: basicModels.length,
        successful: successfulModels.length,
        workingModel: workingModel,
        hasWorkingModels: successfulModels.length > 0,
      },
      results,
      recommendation:
        successfulModels.length > 0
          ? `Usar modelo: ${workingModel}`
          : 'Considerar usar OpenAI como alternativa',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error general al probar modelos básicos',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
