import { NextApiRequest, NextApiResponse } from 'next';
import { SpeechClient } from '@google-cloud/speech';
import { IncomingForm } from 'formidable';

const client = new SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const form = new IncomingForm();
    const [fields, files] = await form.parse(req);

    const audioFile = files.audio?.[0];
    if (!audioFile) {
      return res.status(400).json({ error: 'No se encontró archivo de audio' });
    }

    const audioBytes = require('fs').readFileSync(audioFile.filepath);

    const request = {
      audio: {
        content: audioBytes.toString('base64'),
      },
      config: {
        encoding: 'WEBM_OPUS' as const,
        sampleRateHertz: 48000,
        languageCode: 'es-ES',
      },
    };

    const [response] = await client.recognize(request);
    const transcription = response.results
      ?.map((result) => result.alternatives?.[0].transcript)
      .join('\n');

    res.status(200).json({ transcription });
  } catch (error) {
    console.error('Error en speech-to-text:', error);
    res.status(500).json({ error: 'Error al transcribir audio' });
  }
}
