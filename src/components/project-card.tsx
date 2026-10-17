import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiExternalLink,
  FiGithub,
  FiGlobe,
} from "react-icons/fi";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const detailUrl = project.slug ? `/projects/${project.slug}` : null;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:border-line-hover hover:shadow-xl hover:shadow-black/30">
      {/* 16:9 Thumbnail Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-chip">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 540px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-mono text-xs text-hint">
            {"// no preview image"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-panel/70 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex-1">
          <h3 className="text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-acc">
            {detailUrl ? (
              <Link href={detailUrl} className="hover:underline">
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>

          {project.show_description && project.description && (
            <p className="mt-2.5 text-sm text-body leading-relaxed line-clamp-2">
              {project.description}
            </p>
          )}

          {/* Tech Badges */}
          {project.tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-line-chip bg-chip px-2.5 py-1 font-mono text-[11px] text-body"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer Links */}
        <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
          <div className="flex items-center gap-3">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-success"
                title="Buka Live Demo"
              >
                <FiGlobe className="h-3.5 w-3.5" />
                <span>demo</span>
                <FiExternalLink className="h-2.5 w-2.5" />
              </a>
            )}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-ink"
                title="Buka Repositori GitHub"
              >
                <FiGithub className="h-3.5 w-3.5" />
                <span>repo</span>
                <FiExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>

          {detailUrl && (
            <Link
              href={detailUrl}
              className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-acc transition-transform group-hover:translate-x-1"
            >
              <span>
                {project.doc_source !== "none" ? "Dokumentasi" : "Detail"}
              </span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
