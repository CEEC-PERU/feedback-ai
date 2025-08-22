import { NextRequest, NextResponse } from 'next/server';
import { VertexAI } from '@google-cloud/vertexai';
import pdf from 'pdf-parse';
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation } = body;
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversación requerida' },
        { status: 400 }
      );
    }

    // Leer PDF
    let scriptReference: string;
    try {
      const pdfPath = path.join(
        process.cwd(),
        'public',
        'scripts',
        'script_oncoplus.pdf'
      );
      const buffer = await fs.readFile(pdfPath);
      const data = await pdf(buffer);
      scriptReference = data.text;
    } catch (pdfError) {
      return NextResponse.json(
        { error: 'No se pudo leer el PDF', details: String(pdfError) },
        { status: 500 }
      );
    }

    // Credenciales
    try {
      const secretPath = path.join(
        process.cwd(),
        'secrets',
        'voicebot-novatrainer-34f565779f7e.json'
      );
      if (!fsSync.existsSync(secretPath)) {
        fsSync.mkdirSync(path.dirname(secretPath), { recursive: true });
        const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (!creds)
          throw new Error(
            'Variable GOOGLE_APPLICATION_CREDENTIALS_JSON no definida'
          );
        fsSync.writeFileSync(secretPath, creds);
      }
      process.env.GOOGLE_APPLICATION_CREDENTIALS = secretPath;
    } catch (credError) {
      return NextResponse.json(
        { error: 'Error en credenciales', details: String(credError) },
        { status: 500 }
      );
    }

    // VertexAI
    let responseText = '';
    try {
      const vertex_ai = new VertexAI({
        project: process.env.GOOGLE_PROJECT_ID!,
        location: 'europe-west3',
      });
      const model = vertex_ai.preview.getGenerativeModel({
        model: 'gemini-1.5-pro',
      });
      const prompt = `
Eres un experto en ventas telefónicas y formación de equipos. Analiza la siguiente conversación de ventas entre operador y cliente. Compara la conversación con el siguiente script de referencia. Proporciona un feedback breve y estructurado en TEXTO PLANO, resaltando los puntos clave y recomendaciones para el asesor. No uses formato JSON ni markdown, responde SOLO con el texto explicativo, directo para mostrar en frontend.

CONVERSACIÓN:
${conversation}

SCRIPT DE REFERENCIA:
${scriptReference}

Responde SOLO con texto plano, sin comillas, sin bloques de código, sin etiquetas.
`;
      const result = await model.generateContent(prompt);
      responseText =
        result.response.candidates?.[0]?.content?.parts?.[0]?.text || '';
      responseText = responseText
        .replace(/^\s*```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim();
    } catch (vertexError) {
      return NextResponse.json(
        { error: 'Error llamando a Vertex AI', details: String(vertexError) },
        { status: 500 }
      );
    }

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
