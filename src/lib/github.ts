import "server-only";

export type RepoRef = { owner: string; repo: string };

/**
 * Extract `{ owner, repo }` from a GitHub repo URL. Tolerates a trailing
 * slash, a `.git` suffix, and extra path segments (e.g. /tree/main).
 * Returns null for anything that isn't a github.com repo URL.
 */
export function parseRepo(url: string | null | undefined): RepoRef | null {
  if (!url) return null;
  try {
    const u = new URL(url.trim());
    if (!/(^|\.)github\.com$/i.test(u.hostname)) return null;
    const [owner, repoRaw] = u.pathname.replace(/^\/+/, "").split("/");
    if (!owner || !repoRaw) return null;
    const repo = repoRaw.replace(/\.git$/i, "");
    return repo ? { owner, repo } : null;
  } catch {
    return null;
  }
}

/** Raw base for resolving a README's relative asset paths (uses HEAD branch). */
export function repoRawBase({ owner, repo }: RepoRef): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`;
}

export type ReadmeResult =
  | { ok: true; markdown: string; baseUrl: string }
  | { ok: false; error: string };

/**
 * Fetch a repo's README as raw Markdown via the GitHub API. Works for private
 * repos when `GITHUB_TOKEN` (a PAT with contents:read) is set in the env — the
 * repo never needs to be made public. Response is cached for `revalidateSeconds`.
 */
export async function fetchReadme(
  ref: RepoRef,
  revalidateSeconds = 600,
): Promise<ReadmeResult> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.raw+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "pibiporto-portfolio",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${ref.owner}/${ref.repo}/readme`,
      { headers, next: { revalidate: revalidateSeconds } },
    );

    if (res.status === 404) {
      return {
        ok: false,
        error: token
          ? "README atau repo tidak ditemukan (atau token tak punya akses)."
          : "README/repo tidak ditemukan. Repo private butuh GITHUB_TOKEN.",
      };
    }
    if (res.status === 401 || res.status === 403) {
      return {
        ok: false,
        error: "Akses GitHub ditolak — cek GITHUB_TOKEN atau rate limit.",
      };
    }
    if (!res.ok) {
      return { ok: false, error: `GitHub API error (${res.status}).` };
    }

    const markdown = await res.text();
    return { ok: true, markdown, baseUrl: repoRawBase(ref) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
