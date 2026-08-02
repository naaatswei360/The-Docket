import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';

export const runtime = 'nodejs';

// Turns an uploaded memorial file into plain text so it flows through the
// exact same grading path (/api/assess) as something the user typed —
// nothing downstream needs to know or care whether the text was typed or
// extracted from a document.
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file received.' }, { status: 400 });
    }

    const name = file.name || '';
    const ext = name.split('.').pop().toLowerCase();
    const buffer = Buffer.from(await file.arrayBuffer());

    let text = '';

    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === 'pdf') {
      const result = await pdfParse(buffer);
      text = result.text;
    } else {
      return Response.json(
        { error: 'Unsupported file type — please upload a .docx or .pdf.' },
        { status: 400 }
      );
    }

    text = text.trim();

    if (!text) {
      return Response.json(
        { error: "Couldn't find any readable text in that file — it may be a scanned image rather than real text." },
        { status: 422 }
      );
    }

    return Response.json({ text });
  } catch (err) {
    console.error('Extract memorial error:', err);
    return Response.json({ error: 'Could not read that file. Try a different file or paste the text instead.' }, { status: 500 });
  }
}
