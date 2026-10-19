"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import { getProjectCategory, PROJECT_CATEGORIES } from "@/lib/project-category";
import type { Project, ProjectCategory } from "@/lib/types";

type FilterOption = "all" | ProjectCategory;

const FILTERS: { key: FilterOption; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "website", label: "#website" },
  { key: "mobile", label: "#mobile" },
  { key: "software", label: "#software" },
];

export function ProjectList({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((p) => getProjectCategory(p) === activeFilter);
  }, [projects, activeFilter]);

  const counts = useMemo(() => {
    const res: Record<FilterOption, number> = {
      all: projects.length,
      website: 0,
      mobile: 0,
      software: 0,
    };
    for (const p of projects) {
      const cat = getProjectCategory(p);
      if (res[cat] !== undefined) res[cat]++;
    }
    return res;
  }, [projects]);

  return (
    <div>
      {/* Hashtag Filter Bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.key;
          const count = counts[f.key];
          const catConfig = f.key !== "all" ? PROJECT_CATEGORIES[f.key] : null;

          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-mono text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? catConfig
                    ? `${catConfig.badgeClass} ring-1 ring-current shadow-md`
                    : "border-acc bg-acc text-bg font-semibold shadow-md"
                  : "border-line-input bg-panel/60 text-muted hover:border-line-hover hover:text-ink hover:bg-panel"
              }`}
            >
              {catConfig && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${catConfig.dotClass}`}
                />
              )}
              <span>{f.label}</span>
              <span
                className={`ml-1 text-[11px] opacity-75 ${
                  isActive ? "" : "text-hint"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-12 text-center font-mono text-xs text-hint">
          Belum ada project dengan kategori #{activeFilter}.
        </div>
      )}
    </div>
  );
}
