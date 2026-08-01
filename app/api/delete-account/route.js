import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key — bypasses RLS,
// never exposed to the browser. Only this route (and /api/assess) use it.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Deletes the account belonging to whoever's access token is sent — never
// the id in the request body, so one signed-in user can't delete another's
// account by editing a request.
export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
      return Response.json({ error: 'Not signed in.' }, { status: 401 });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData?.user) {
      return Response.json({ error: 'Not signed in.' }, { status: 401 });
    }

    // profiles / submissions / reference_progress all have
    // "on delete cascade" on their user_id foreign key, so removing the
    // auth user cleans up every related row automatically.
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userData.user.id);

    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: err.message || 'Something went wrong.' }, { status: 500 });
  }
}
