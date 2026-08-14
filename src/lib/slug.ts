/**
 * Turn a title into a URL-safe slug: lowercase, non-alphanumeric runs become
 * a single hyphen, and leading/trailing hyphens are trimmed.
 * e.g. "Discord Bot v2!" → "discord-bot-v2". Must mirror the SQL backfill in
 * `supabase/project-docs.sql` so new and existing slugs are consistent.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
