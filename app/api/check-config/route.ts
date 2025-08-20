import { NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { resolve } from 'path';

export async function GET() {
  const credentialsPath = resolve(
    process.cwd(),
    './secrets/voicebot-novatrainer-34f565779f7e.json'
  );

  return NextResponse.json({
    message: 'Verificación de configuración',
    timestamp: new Date().toISOString(),
    config: {
      project_id: !!process.env.GOOGLE_PROJECT_ID,
      project_id_value: process.env.GOOGLE_PROJECT_ID,
      credentials_env: !!process.env.GOOGLE_APPLICATION_CREDENTIALS,
      credentials_path: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      pdf_url: !!process.env.SCRIPT_PDF_URL,
      credentials_file_exists: existsSync(credentialsPath),
      working_directory: process.cwd(),
      full_credentials_path: credentialsPath,
    },
  });
}
