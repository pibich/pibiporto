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
  boosting_open: boolean;
  profile_image_url: string | null;
  updated_at: string;
};

export type Game = {
  id: string;
  name: string;
  tags: string[];
  image_url: string | null;
  created_at: string;
};

export type Testimonial = {
  id: string;
  image_url: string;
  created_at: string;
};
