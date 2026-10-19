import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiExternalLink,
  FiGithub,
  FiGlobe,
} from "react-icons/fi";
import { getProjectCategory, PROJECT_CATEGORIES } from "@/lib/project-category";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const detailUrl = project.slug ? `/projects/${project.slug}` : null;
  const category = getProjectCategory(project);
  const catConfig = PROJECT_CATEGORIES[category];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all duration-300 hover:border-line-hover hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 cursor-pointer">
      {/* Clickable Overlay Link for the entire Box */}
      {detailUrl && (
        <Link
          href={detailUrl}
          className="absolute inset-0 z-0"
          aria-label={`Buka detail project ${project.title}`}
        />
      )}

      {/* 16:9 Thumbnail Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-chip pointer-events-none">
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
        <div className="absolute inset-0 bg-gradient-to-t from-panel/70 via-transparent to-transparent opacity-60" />
      </div>

      {/* Card Content */}
      <div className="relative z-10 flex flex-1 flex-col p-6 sm:p-7 pointer-events-none">
        <div className="flex-1">
          {/* Hashtag Badge */}
          <div className="mb-2.5 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide transition-colors ${catConfig.badgeClass}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${catConfig.dotClass}`}
              />
              <span>{catConfig.hashtag}</span>
            </span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-ink transition-colors group-hover:text-acc">
            {project.title}
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
        <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/btn relative z-20 inline-flex items-center gap-1.5 rounded-lg border border-line-chip bg-chip/80 px-3 py-1.5 font-mono text-xs font-semibold text-ink transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400 hover:scale-105 active:scale-95"
                title="Buka Live Demo"
              >
                <FiGlobe className="h-4.5 w-4.5 text-emerald-400 group-hover/btn:scale-110 transition-transform" />
                <span>Demo</span>
                <FiExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="group/btn relative z-20 inline-flex items-center gap-1.5 rounded-lg border border-line-chip bg-chip/80 px-3 py-1.5 font-mono text-xs font-semibold text-ink transition-all hover:border-acc/50 hover:bg-acc/10 hover:text-acc hover:scale-105 active:scale-95"
                title="Buka Repositori GitHub"
              >
                <FiGithub className="h-4.5 w-4.5 text-ink group-hover/btn:scale-110 transition-transform" />
                <span>Repo</span>
                <FiExternalLink className="h-3 w-3 opacity-60" />
              </a>
            )}
          </div>

          {detailUrl && (
            <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-acc transition-transform group-hover:translate-x-1">
              <span>
                {project.doc_source !== "none" ? "Dokumentasi" : "Detail"}
              </span>
              <FiArrowRight className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
