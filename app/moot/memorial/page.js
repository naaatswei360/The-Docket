'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthProvider';
import { supabase } from '../../../lib/supabaseClient';
import ComingSoon from '../../../components/ComingSoon';

export default function MemorialPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [moot, setMoot] = useState(null);
  const [inputMode, setInputMode] = useState('type'); // 'type' | 'upload'
  const [memorialText, setMemorialText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null); // { name, path }
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [draftStage, setDraftStage] = useState('first');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  useEffect(() => {
    supabase
      .from('moots')
      .select('*')
      .eq('type', 'general')
      .limit(1)
      .maybeSingle()
      .then(({ data, error: mootError }) => {
        if (mootError) setError(mootError.message);
        else setMoot(data);
      });
  }, []);

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadError('');
    setUploading(true);
    setUploadedFile(null);

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!['docx', 'pdf'].includes(ext)) {
        throw new Error('Please upload a .docx or .pdf file.');
      }

      // 1) Extract text first — if we can't read it, no point uploading it.
      const formData = new FormData();
      formData.append('file', file);
      const extractRes = await fetch('/api/extract-memorial', { method: 'POST', body: formData });
      const extractData = await extractRes.json();
      if (!extractRes.ok) throw new Error(extractData.error || 'Could not read that file.');

      // 2) Keep the original file in Storage so it's not lost — same
      // format the person actually submitted, not just the extracted text.
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage.from('memorials').upload(path, file);
      if (uploadErr) throw new Error(uploadErr.message);

      setMemorialText(extractData.text);
      setUploadedFile({ name: file.name, path });
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || !moot) return;
    setSubmitting(true);
    setError('');
    setFeedback('');

    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          mootId: moot.id,
          draftStage,
          memorialText,
          fileName: uploadedFile?.name || null,
          filePath: uploadedFile?.path || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong assessing your memorial.');

      setFeedback(data.feedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!moot) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-gray-400">
        Loading moot problem…
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/home" className="mb-6 inline-block text-sm text-gray-400 underline hover:text-gray-200">
          ← Back to home
        </Link>

        <h1 className="mb-1 text-2xl font-bold text-white">{moot.title}</h1>
        <p className="mb-6 text-xs uppercase tracking-widest text-docket-gold">General Moot</p>

        <div className="mb-6 rounded-lg border border-gray-700 bg-docket-navy2 p-4">
          <h2 className="mb-1 font-semibold text-gray-200">Facts</h2>
          <p className="mb-4 text-sm text-gray-400">{moot.facts}</p>
          <h2 className="mb-1 font-semibold text-gray-200">Issues</h2>
          <p className="text-sm text-gray-400">{moot.issues}</p>
        </div>

        {!feedback && (
          <form onSubmit={handleSubmit}>
            <label className="mb-1 block text-sm text-gray-300">Any additional facts you're relying on (optional)</label>
            <textarea
              rows={2}
              placeholder="Leave blank if you're only working from the facts above."
              className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-sm"
            />

            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode('type')}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  inputMode === 'type'
                    ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                Type it
              </button>
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  inputMode === 'upload'
                    ? 'border-docket-gold bg-docket-gold/10 text-docket-gold'
                    : 'border-gray-600 text-gray-300 hover:border-gray-400'
                }`}
              >
                Upload a document
              </button>
            </div>

            {inputMode === 'upload' && (
              <div className="mb-4 rounded-lg border border-dashed border-gray-500 bg-docket-navy2 p-5">
                <label className="mb-1 block text-sm text-gray-300">Upload your memorial (.docx or .pdf)</label>
                <p className="mb-3 text-xs text-gray-500">
                  Keeps your formatting intact — we'll pull the text out to grade it, and keep the original file too.
                </p>
                <input
                  type="file"
                  accept=".docx,.pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="mb-2 block w-full text-sm text-gray-300 file:mr-3 file:rounded-lg file:border-0 file:bg-docket-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-docket-navy hover:file:bg-docket-gold2"
                />
                {uploading && <p className="text-xs text-gray-400">Reading your file…</p>}
                {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                {uploadedFile && !uploading && (
                  <p className="text-xs text-emerald-400">
                    ✓ {uploadedFile.name} uploaded and read — review the extracted text below before submitting.
                  </p>
                )}
              </div>
            )}

            <label className="mb-1 block text-sm text-gray-300">
              {inputMode === 'upload' ? 'Extracted text (edit if anything looks off)' : 'Your memorial'}
            </label>
            <textarea
              required
              rows={12}
              value={memorialText}
              onChange={(e) => setMemorialText(e.target.value)}
              className="mb-4 w-full rounded-lg border border-gray-600 bg-white px-3 py-2 text-sm"
              placeholder={
                inputMode === 'upload' ? 'Upload a file above to fill this in…' : 'Write or paste your memorial here…'
              }
            />

            <label className="mb-1 block text-sm text-gray-300">Draft stage</label>
            <select
              value={draftStage}
              onChange={(e) => setDraftStage(e.target.value)}
              className="mb-6 w-full rounded-lg border border-gray-600 bg-white px-3 py-2"
            >
              <option value="first">First draft</option>
              <option value="final">Final draft</option>
            </select>

            {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-docket-gold px-6 py-3 font-semibold text-docket-navy hover:bg-docket-gold2 disabled:opacity-60"
            >
              {submitting ? 'Assessing…' : 'Submit for Assessment'}
            </button>
          </form>
        )}

        {feedback && (
          <div>
            <div className="mb-6 rounded-lg border border-docket-gold/40 bg-docket-navy2 p-6">
              <h2 className="mb-4 text-lg font-semibold text-docket-gold">Assessor Feedback</h2>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-200">{feedback}</pre>
            </div>

            <div className="mb-6">
              <ComingSoon label="View Rankings" className="w-full" />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFeedback('');
                  setMemorialText('');
                  setUploadedFile(null);
                  setInputMode('type');
                }}
                className="flex-1 rounded-lg border border-docket-gold/50 px-5 py-3 font-semibold text-docket-gold hover:bg-docket-navy2"
              >
                Submit another draft
              </button>
              <Link
                href="/submissions"
                className="flex-1 rounded-lg bg-docket-gold px-5 py-3 text-center font-semibold text-docket-navy hover:bg-docket-gold2"
              >
                View submission history
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}