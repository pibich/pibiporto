import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { SiteFooter } from "@/components/site-footer";
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
      docNote = "Sumber diatur ke GitHub, tapi link repo belum valid.";
    } else {
      const readme = await fetchReadme(ref);
      if (readme.ok) {
        docContent = readme.markdown;
        docBaseUrl = readme.baseUrl;
      } else {
        // Fall back to the last stored copy so the page never breaks.
        docNote = `README GitHub belum bisa dimuat (${readme.error})${
          project.documentation ? " — menampilkan salinan tersimpan." : "."
        }`;
      }
    }
  }

  return (
    <>
      <article className="mx-auto max-w-[820px] px-7 pt-10 pb-[56px]">
        <Link
          href="/#projects"
          className="font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
        >
          ← kembali ke projects
        </Link>

        <h1 className="mt-6 text-[32px] font-bold tracking-[-0.01em]">
          {project.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[12px] text-hint">
          <span>{dateFmt.format(new Date(project.created_at))}</span>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-acc hover:underline"
            >
              demo ↗
            </a>
          )}
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-ink"
            >
              repo ↗
            </a>
          )}
        </div>

        {project.tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-[7px]">
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

        {project.image_url && (
          <div className="relative mt-7 aspect-video w-full overflow-hidden rounded-xl border border-line bg-chip">
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              sizes="(max-width: 820px) 100vw, 820px"
              className="object-cover"
              priority
            />
          </div>
        )}

        {showDescription && (
          <p className="mt-7 text-[17px] leading-[1.75] text-prose text-pretty">
            {project.description}
          </p>
        )}

        {docEnabled && (
          <div className="mt-8 border-t border-line pt-8">
            {docNote && (
              <p className="mb-5 rounded-lg border border-line-input bg-panel px-4 py-3 font-mono text-[12px] text-muted">
                {docNote}
              </p>
            )}
            {docContent ? (
              <Markdown baseUrl={docBaseUrl}>{docContent}</Markdown>
            ) : (
              !docNote && (
                <p className="font-mono text-[13px] text-hint">
                  Belum ada dokumentasi untuk project ini.
                </p>
              )
            )}
          </div>
        )}
      </article>

      <SiteFooter />
    </>
  );
}
