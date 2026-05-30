import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// Service role key — used ONLY for admin-side user creation via auth.admin.createUser().
// This bypasses email confirmation and works regardless of Supabase Auth settings.
// ⚠️  Never expose this to end-users. This app is an internal admin tool;
//     if it ever becomes public-facing, move user creation to a server-side Edge Function.
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Validate env vars at startup so the error is immediately obvious
// instead of a cryptic "Cannot read properties of undefined" at runtime.
if (!supabaseUrl || !supabaseKey) {
  const missing = [
    !supabaseUrl && 'VITE_SUPABASE_URL',
    !supabaseKey && 'VITE_SUPABASE_ANON_KEY',
  ].filter(Boolean).join(', ')
  throw new Error(
    `[supabaseClient] Missing required environment variable(s): ${missing}. ` +
    `Add them to your .env file locally, or to the Render environment variables panel.`
  )
}

// Standard client — uses anon key, respects RLS. Used for all normal data operations.
export const supabase = createClient(supabaseUrl, supabaseKey)

// Admin client — uses service role key, bypasses RLS.
// Used ONLY for auth.admin.createUser() in the staff creation flow.
// Falls back to null if the env var is not set; callers must guard against this.
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        // Prevent this client from touching the browser's auth storage so it
        // never conflicts with the logged-in admin's own session.
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null
