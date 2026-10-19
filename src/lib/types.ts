export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "baas"
  | "mobile"
  | "ai"
  | "tools"
  | "lainnya";

export type TechItem = {
  id: string;
  name: string;
  category: TechCategory;
  icon_slug: string | null;
  color: string | null;
  sort_order: number;
  created_at: string;
};

export type DocSource = "manual" | "github" | "none";

export type ProjectCategory = "website" | "mobile" | "software";

export type Project = {
  id: string;
  title: string;
  category?: ProjectCategory | string | null;
  description: string | null;
  demo_url: string | null;
  repo_url: string | null;
  tech: string[];
  image_url: string | null;
  slug: string | null;
  documentation: string | null;
  doc_source: DocSource;
  show_description: boolean;
  created_at: string;
};

export type Settings = {
  id: boolean;
  profile_image_url: string | null;
  cv_url: string | null;
  updated_at: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};
