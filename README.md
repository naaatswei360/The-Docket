# The Docket — Prototype

Minimal working slice of the moot training platform: sign up → retainer →
pick the seeded General Moot → submit a written memorial → get AI feedback
→ see it again later. Everything else in the fuller spec is a visible but
disabled placeholder, exactly as scoped.

## What's built

- **Entry / Signup / Login** — Supabase email+password auth. On signup you're
  immediately assigned a **code name** and a **newcomer number**, stored in
  `profiles`.
- **Plans page** — "Start Free" works and takes you into the app. Paid plans
  and the payment page (mobile money / bank card) are disabled placeholders.
- **Retainer** — one-time profile form (name, gender, experience, goal, notes).
- **Home** — swaying "Daily Docket Tip" banner (rotates once per calendar
  day), then Memorial vs Oral. Oral is a disabled "coming soon" page.
  Memorial then offers Curated (functional) / Specialized / Freestyle
  (disabled).
- **Memorial submission** — shows the seeded "Geoffrey Smith" moot's facts
  and issues, a memorial textarea, and a first/final draft dropdown. On
  submit it calls Claude Haiku server-side and shows structured feedback
  against the 5-criteria framework, saved to `submissions`.
- **Submission history** — past memorials + feedback for the logged-in user.
- **Admin** — `/admin`, gated to `Priscilla.photos@gmail.com` (hardcoded
  check, not a real role system), lists every submission across users.
- **Help / customer service** — a corner "Help" button on every page opens
  `/help`, a blank message box that posts straight to your Formspree
  endpoint (`https://formspree.io/f/xqergnbk`).

## Out of scope (per spec) — left as disabled placeholders or omitted

Payments/Paystack, free-attempt cap, oral/voice judges, rankings/leaderboards,
skins, specialized/freestyle moot content, mirror mode & recordings.

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `supabase/schema.sql` from this repo. It creates
   `profiles`, `moots` (seeded with the Geoffrey Smith moot), `submissions`,
   and their RLS policies.
3. In **Authentication → Providers → Email**, for the fastest prototype loop,
   turn **off** "Confirm email" so signup returns an active session
   immediately (so the code name/number can be assigned right away, as
   specced). Turn it back on before any real users touch this.
4. Grab your Project URL and anon key from **Project Settings → API**, and
   your **service role key** (keep this secret, server-side only).

### 2. Anthropic

Get an API key from [console.anthropic.com](https://console.anthropic.com).

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-haiku-4-5-20251001
ADMIN_EMAIL=Priscilla.photos@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL=Priscilla.photos@gmail.com
```

### 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

### 5. Deploy

Push to GitHub, import into [Vercel](https://vercel.com), and add the same
environment variables in the Vercel project settings. Deploy.

## Notes / assumptions

- Only one moot ("Geoffrey Smith") is seeded, as specced — the memorial
  page always loads whichever row has `type = 'general'`.
- The admin check is a hardcoded email string, not a real role system.
- The customer service button links to a real page (`/help`) rather than a
  bare `mailto:` link, since you asked for it wired to your Formspree form
  instead.
- The AI assessor returns free-text (not JSON) so it renders straight into
  the feedback panel and into `submissions.feedback_text`. Let me know if
  you'd rather have structured JSON (e.g. for a scorecard UI later).
