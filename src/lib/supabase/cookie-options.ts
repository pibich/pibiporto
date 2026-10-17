import type { CookieOptionsWithName } from "@supabase/ssr";

/**
 * Shared auth-cookie settings for every Supabase client (browser, server,
 * proxy). Access tokens only live ~1 hour; giving the cookie a 30-day maxAge
 * lets the proxy silently refresh the session with the refresh token across
 * browser restarts, so the admin stays logged in instead of bouncing back
 * to /login.
 *
 * `httpOnly: false` is required because `@supabase/ssr`'s browser client
 * (`createBrowserClient`) needs to read the auth session from `document.cookie`
 * to perform authenticated client-side requests, such as image uploads to
 * Supabase Storage with RLS policies requiring the `authenticated` role.
 */
export const AUTH_COOKIE_OPTIONS: CookieOptionsWithName = {
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: false,
};
