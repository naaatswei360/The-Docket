import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key — bypasses RLS,
// never exposed to the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ASSESSOR_INSTRUCTIONS = `
You are an experienced moot court judge and legal writing coach assessing a student's written memorial.

Evaluate the memorial strictly against these five criteria, giving 2-3 specific, actionable comments per criterion (not just a score):

1. Structure & roadmap clarity
2. Legal reasoning & argument strength
3. Use of authority/citations
4. Persuasiveness & advocacy tone
5. Accuracy on the facts of the case

Ground every comment in the specific text of the memorial and the facts/issues of the moot problem provided. Be direct and constructive — this is training, not a pass/fail exam.

Format your response as plain text with a clear heading for each of the five criteria, followed by a short bulleted list of comments under each heading. Do not include a numeric score. End with a short "Overall" paragraph (3-4 sentences) summarising the single most important thing this student should fix next.
`.trim();

export async function POST(req) {
  try {
    const { userId, mootId, draftStage, memorialText } = await req.json();

    if (!userId || !mootId || !draftStage || !memorialText) {
      return Response.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const { data: moot, error: mootError } = await supabaseAdmin
      .from('moots')
      .select('title, facts, issues')
      .eq('id', mootId)
      .single();

    if (mootError || !moot) {
      return Response.json({ error: 'Could not load the moot problem.' }, { status: 404 });
    }

    const userPrompt = `
MOOT PROBLEM: ${moot.title}

FACTS:
${moot.facts}

ISSUES:
${moot.issues}

DRAFT STAGE: ${draftStage === 'final' ? 'Final draft' : 'First draft'}

STUDENT'S MEMORIAL:
"""
${memorialText}
"""
`.trim();

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: ASSESSOR_INSTRUCTIONS,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error('Anthropic API error:', errText);
      return Response.json({ error: 'The assessor is unavailable right now.' }, { status: 502 });
    }

    const anthropicData = await anthropicRes.json();
    const feedback = (anthropicData.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n\n')
      .trim();

    const { data: submission, error: insertError } = await supabaseAdmin
      .from('submissions')
      .insert({
        user_id: userId,
        moot_id: mootId,
        draft_stage: draftStage,
        memorial_text: memorialText,
        feedback_text: feedback,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return Response.json({ error: 'Feedback generated but could not be saved.' }, { status: 500 });
    }

    return Response.json({ feedback, submissionId: submission.id });
  } catch (err) {
    console.error('Assess route error:', err);
    return Response.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
