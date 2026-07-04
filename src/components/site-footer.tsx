import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-7 py-6">
        <div className="font-mono text-xs text-hint">
          © 2026 Vincent Bryan — dibuat dengan Next.js &amp; ☕
        </div>
        <div className="flex gap-[18px]">
          <a
            href="https://github.com/pibich"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted transition-colors hover:text-ink"
          >
            github
          </a>
          <a
            href="https://www.youtube.com/@pibichori"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-muted transition-colors hover:text-ink"
          >
            youtube
          </a>
          <Link
            href="/login"
            className="font-mono text-xs text-hint transition-colors hover:text-muted"
          >
            admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
