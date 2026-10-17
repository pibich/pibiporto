import Link from "next/link";
import { FiLock } from "react-icons/fi";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-panel/30">
      <div className="mx-auto flex max-w-[1100px] flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-8 py-8">
        <div className="font-mono text-xs text-muted text-center sm:text-left">
          © {new Date().getFullYear()} Vincent Bryan — Dirancang dengan estetika
          minimalis & Next.js
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-muted">
          <a
            href="https://github.com/pibich"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            github
          </a>
          <a
            href="https://linkedin.com/in/vincentbryanid"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            linkedin
          </a>
          <a
            href="https://www.youtube.com/@pibichori"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            youtube
          </a>

          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-hint transition-colors hover:text-muted"
            title="Area Administrator"
          >
            <FiLock className="h-3 w-3" />
            <span>admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
