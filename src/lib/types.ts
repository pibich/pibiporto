export const TECH_OPTIONS = [
  "HTML",
  "CSS",
  "JavaScript",
  "Next.js",
  "Tailwind CSS",
  "Supabase",
] as const;

export type Tech = (typeof TECH_OPTIONS)[number];

export type Project = {
  id: string;
  title: string;
  description: string | null;
  demo_url: string | null;
  repo_url: string | null;
  tech: string[];
  image_url: string | null;
  created_at: string;
};

export type Settings = {
  id: boolean;
  profile_image_url: string | null;
  updated_at: string;
};
