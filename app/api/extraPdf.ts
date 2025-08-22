import pdf from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';

export const LOCAL_PDF_PATH = path.join(
  process.cwd(),
  'public',
  'scripts',
  'script_oncoplus.pdf'
);

export async function extractLocalPdfText(filePath: string): Promise<string> {
  try {
    const buffer = await fs.readFile(filePath);
    const data = await pdf(buffer);
    return data.text;
  } catch (err) {
    throw new Error('ERROR leyendo PDF: ' + String(err));
  }
}
