import Image from "next/image";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-[14px] border border-line bg-panel transition-colors hover:border-line-hover">
      <div className="relative block h-[220px] w-full bg-chip">
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
      <div className="px-6 pt-[22px] pb-6">
        <h3 className="text-[19px] font-semibold">{project.title}</h3>
        {project.description && (
          <p className="mt-2 text-[14.5px] leading-[1.6] text-muted">
            {project.description}
          </p>
        )}
        {project.tech.length > 0 && (
          <div className="mt-[14px] flex flex-wrap gap-[7px]">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-[5px] bg-chip px-[9px] py-1 font-mono text-[11px] text-body"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-4">
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
