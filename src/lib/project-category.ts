import type { ProjectCategory } from "./types";

export interface ProjectCategoryConfig {
  key: ProjectCategory;
  label: string;
  hashtag: string;
  badgeClass: string;
  dotClass: string;
}

export const PROJECT_CATEGORIES: Record<
  ProjectCategory,
  ProjectCategoryConfig
> = {
  website: {
    key: "website",
    label: "Website",
    hashtag: "#website",
    badgeClass:
      "border-sky-500/30 bg-sky-500/10 text-sky-400 group-hover:border-sky-500/50",
    dotClass: "bg-sky-400",
  },
  mobile: {
    key: "mobile",
    label: "Mobile App",
    hashtag: "#mobile",
    badgeClass:
      "border-violet-500/30 bg-violet-500/10 text-violet-400 group-hover:border-violet-500/50",
    dotClass: "bg-violet-400",
  },
  software: {
    key: "software",
    label: "Software",
    hashtag: "#software",
    badgeClass:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 group-hover:border-emerald-500/50",
    dotClass: "bg-emerald-400",
  },
};

export function getProjectCategory(project: {
  category?: string | null;
  title?: string;
  description?: string | null;
  tech?: string[];
}): ProjectCategory {
  if (project.category) {
    const cat = project.category.toLowerCase().trim();
    if (cat.includes("mobile") || cat === "android" || cat === "ios") {
      return "mobile";
    }
    if (
      cat.includes("soft") ||
      cat.includes("desktop") ||
      cat.includes("app") ||
      cat.includes("bot") ||
      cat.includes("cli")
    ) {
      return "software";
    }
    if (cat.includes("web") || cat.includes("site")) {
      return "website";
    }
  }

  const combined =
    `${project.title || ""} ${project.description || ""} ${(project.tech || []).join(" ")}`.toLowerCase();

  // Mobile check
  if (
    combined.includes("react native") ||
    combined.includes("flutter") ||
    combined.includes("android") ||
    combined.includes("ios") ||
    combined.includes("kotlin") ||
    combined.includes("swift") ||
    combined.includes("mobile")
  ) {
    return "mobile";
  }

  // Software / Bot / Desktop check
  if (
    combined.includes("bot discord") ||
    combined.includes("discord bot") ||
    combined.includes("soundboard") ||
    combined.includes("bgm player") ||
    combined.includes("desktop") ||
    combined.includes("cli") ||
    combined.includes("electron") ||
    combined.includes("software")
  ) {
    return "software";
  }

  // Default to website
  return "website";
}
