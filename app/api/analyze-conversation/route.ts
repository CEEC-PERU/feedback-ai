import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import { extractLocalPdfText, LOCAL_PDF_PATH } from '../extraPdf';
import path from 'path';
import fsSync from 'fs'; // Importación para sync

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation } = body;
    console.log('Received conversation:', conversation);
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación requerida' },
        { status: 400 }
      );
    }

    // Leer el PDF como script de referencia
    let scriptReference: string;
    try {
      scriptReference = await extractLocalPdfText(LOCAL_PDF_PATH);
    } catch (pdfError) {
      return NextResponse.json(
        {
          error: 'No se pudo leer el PDF del script',
          details: String(pdfError),
        },
        { status: 500 }
      );
    }

    const prompt = `
Eres un experto en ventas telefónicas y formación de equipos. Analiza la siguiente conversación de ventas entre operador y cliente. Compara la conversación con el siguiente script de referencia. Proporciona un feedback breve y estructurado en TEXTO PLANO, resaltando los puntos clave y recomendaciones para el asesor. No uses formato JSON ni markdown, responde SOLO con el texto explicativo, directo para mostrar en frontend.

CONVERSACIÓN:
${conversation}

SCRIPT DE REFERENCIA:
${scriptReference}

Responde SOLO con texto plano, sin comillas, sin bloques de código, sin etiquetas.
`;

    // --- Crea el archivo de credenciales desde la variable de entorno ---
    const secretPath = path.join(
      process.cwd(),
      'secrets',
      'voicebot-novatrainer-34f565779f7e.json'
    );
    if (!fsSync.existsSync(secretPath)) {
      fsSync.mkdirSync(path.dirname(secretPath), { recursive: true });
      fsSync.writeFileSync(
        secretPath,
        process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!
      );
    }
    process.env.GOOGLE_APPLICATION_CREDENTIALS = secretPath;
    // ---------------------------------------------------------------

    // Inicializa VertexAI SIN credentials
    const vertex_ai = new VertexAI({
      project: process.env.GOOGLE_PROJECT_ID!,
      location: 'europe-west3',
    });

    const model = vertex_ai.preview.getGenerativeModel({
      model: 'gemini-1.5-pro',
    });

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (vertexError) {
      return NextResponse.json(
        { error: 'Error llamando a Vertex AI', details: String(vertexError) },
        { status: 500 }
      );
    }

    let responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // El modelo podría devolver ``` o bloques, así que los removemos
    responseText = responseText
      .replace(/^\s*```(?:json)?\s*/i, '') // quita bloque inicial
      .replace(/\s*```\s*$/i, '') // quita bloque final
      .trim();

    // NO intentamos parsear, solo devolvemos el texto plano
    return NextResponse.json({ feedback: responseText });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      {
        error: 'Error al analizar la conversación',
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
