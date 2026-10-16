import type { CookieOptionsWithName } from "@supabase/ssr";

/**
 * Shared auth-cookie settings for every Supabase client (browser, server,
 * proxy). Access tokens only live ~1 hour; giving the cookie a 30-day maxAge
 * lets the proxy silently refresh the session with the refresh token across
 * browser restarts, so the admin stays logged in instead of bouncing back
 * to /login.
 *
 * `httpOnly: true` is honored by the server/proxy writes (Set-Cookie header)
 * and simply ignored by the browser client (document.cookie cannot set it).
 */
export const AUTH_COOKIE_OPTIONS: CookieOptionsWithName = {
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
};
