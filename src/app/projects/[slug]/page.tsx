import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiBookOpen,
  FiCalendar,
  FiExternalLink,
  FiGithub,
  FiGlobe,
} from "react-icons/fi";
import { Markdown } from "@/components/markdown";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getProjectBySlug } from "@/lib/data";
import { fetchReadme, parseRepo } from "@/lib/github";

export const revalidate = 0; // always reflect the latest admin changes

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project tidak ditemukan" };
  return {
    title: `${project.title} — Vincent Bryan`,
    description:
      project.show_description && project.description
        ? project.description
        : undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const showDescription = project.show_description && !!project.description;
  const docEnabled = project.doc_source !== "none";

  // Resolve documentation: live README from GitHub, or the stored copy.
  let docContent = project.documentation;
  let docBaseUrl: string | undefined;
  let docNote: string | null = null;

  if (project.doc_source === "github") {
    const ref = parseRepo(project.repo_url);
    if (!ref) {
      docNote =
        "Sumber dokumentasi diatur ke GitHub, namun link repositori belum diisi.";
    } else {
      const readme = await fetchReadme(ref);
      if (readme.ok) {
        docContent = readme.markdown;
        docBaseUrl = readme.baseUrl;
      } else {
        // Fall back to the last stored copy so the page never breaks.
        docNote = `README GitHub belum dapat dimuat (${readme.error})${
          project.documentation
            ? " — menampilkan salinan dokumentasi tersimpan."
            : "."
        }`;
      }
    }
  }

  return (
    <div className="min-h-dvh bg-bg text-ink selection:bg-acc selection:text-bg">
      <SiteNav />

      <main className="mx-auto max-w-[900px] px-6 sm:px-8 pt-10 pb-24">
        {/* Breadcrumb Back Link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          <FiArrowLeft className="h-3.5 w-3.5" />
          <span>kembali ke daftar project</span>
        </Link>

        {/* Project Header */}
        <div className="mt-6 space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 font-mono text-xs text-muted">
            <span className="inline-flex items-center gap-1.5 text-hint">
              <FiCalendar className="h-3.5 w-3.5" />
              <span>{dateFmt.format(new Date(project.created_at))}</span>
            </span>

            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-acc hover:underline"
              >
                <FiGlobe className="h-3.5 w-3.5" />
                <span>Live Demo</span>
                <FiExternalLink className="h-2.5 w-2.5" />
              </a>
            )}

            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted transition-colors hover:text-ink"
              >
                <FiGithub className="h-3.5 w-3.5" />
                <span>GitHub Repo</span>
                <FiExternalLink className="h-2.5 w-2.5" />
              </a>
            )}
          </div>

          {/* Tech Badges */}
          {project.tech.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-lg border border-line-chip bg-chip px-2.5 py-1 font-mono text-xs text-body"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Project Hero Image */}
        {project.image_url && (
          <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-line bg-chip shadow-2xl">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Short Description */}
        {showDescription && (
          <div className="mt-8 rounded-2xl border border-line/60 bg-panel/50 p-6 sm:p-7">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-muted mb-2">
              {"// ringkasan project"}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-prose text-pretty">
              {project.description}
            </p>
          </div>
        )}

        {/* Documentation Section */}
        {docEnabled && (
          <div className="mt-10 border-t border-line pt-10">
            <div className="flex items-center gap-2 mb-6">
              <FiBookOpen className="h-4 w-4 text-acc" />
              <h2 className="text-lg font-bold text-ink">Dokumentasi Teknis</h2>
            </div>

            {docNote && (
              <div className="mb-6 rounded-xl border border-line-input bg-panel p-4 font-mono text-xs text-muted leading-relaxed">
                {docNote}
              </div>
            )}

            {docContent ? (
              <div className="rounded-2xl border border-line bg-panel/30 p-6 sm:p-8">
                <Markdown baseUrl={docBaseUrl}>{docContent}</Markdown>
              </div>
            ) : (
              !docNote && (
                <div className="rounded-2xl border border-dashed border-line-strong p-8 text-center font-mono text-xs text-hint">
                  Belum ada dokumentasi tertulis untuk project ini.
                </div>
              )
            )}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
