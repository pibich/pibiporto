import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-line bg-panel transition-colors hover:border-line-hover">
      <div className="relative block aspect-video w-full bg-chip">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 528px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[11px] text-hint">
            no image
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-[19px] font-semibold">
          {project.slug ? (
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-acc"
            >
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h3>
        {project.show_description && project.description && (
          <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">
            {project.description}
          </p>
        )}
        {project.tech.length > 0 && (
          <div className="mt-[14px] flex flex-wrap gap-[7px]">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-lg bg-chip px-[9px] py-1 font-mono text-[11px] text-body"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-4">
          {project.slug && (
            <Link
              href={`/projects/${project.slug}`}
              className="font-mono text-[12.5px] text-acc hover:underline"
            >
              {project.doc_source !== "none" ? "dokumentasi" : "detail"} →
            </Link>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12.5px] text-acc hover:underline"
            >
              demo ↗
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              repo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
