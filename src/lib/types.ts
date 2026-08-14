export type TechCategory = "foundation" | "learning" | "design";

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

export type Project = {
  id: string;
  title: string;
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
  updated_at: string;
};
