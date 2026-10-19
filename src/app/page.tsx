import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa6";
import {
  FiArrowUpRight,
  FiMail,
  FiMapPin,
  FiPlay,
  FiTerminal,
  FiUser,
} from "react-icons/fi";
import { SiGithub, SiWhatsapp, SiYoutube } from "react-icons/si";
import { ContactForm } from "@/components/contact-form";
import { Hero } from "@/components/hero";
import { ProjectList } from "@/components/project-list";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { TechIcon } from "@/components/tech-icon";
import { getProjects, getSettings, getTechStack } from "@/lib/data";
import { TECH_CATEGORIES } from "@/lib/tech";
import type { TechItem } from "@/lib/types";
import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 0; // always reflect the latest admin changes

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function SkillChip({ item }: { item: TechItem }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-lg border border-line-chip bg-chip/60 px-3 py-1.5 font-mono text-xs text-ink transition-all hover:border-line-hover hover:bg-chip hover:scale-[1.02]"
      title={`Skill: ${item.name}`}
    >
      <TechIcon
        name={item.name}
        iconSlug={item.icon_slug}
        color={item.color}
        size={14}
        className="flex-none"
      />
      <span>{item.name}</span>
    </span>
  );
}

export default async function Home() {
  const [projects, settings, tech, videos] = await Promise.all([
    getProjects(),
    getSettings(),
    getTechStack(),
    getLatestVideos(3),
  ]);

  const techByCategory = TECH_CATEGORIES.map((cat) => ({
    ...cat,
    items: tech.filter((t) => t.category === cat.key),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="relative min-h-dvh bg-bg text-ink selection:bg-acc selection:text-bg">
      <SiteNav />

      {/* ── HERO ── */}
      <Hero cvUrl={settings.cv_url} />

      {/* ── ABOUT ME ── */}
      <section id="about" className="border-t border-line/80 scroll-mt-16">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 items-start gap-10 px-6 sm:px-8 py-20 sm:grid-cols-[200px_1fr] sm:gap-14">
          {/* Avatar Picture */}
          <div className="relative mx-auto sm:mx-0 flex h-48 w-48 sm:h-52 sm:w-52 items-center justify-center overflow-hidden rounded-2xl border-2 border-line bg-panel p-1.5 shadow-xl transition-all hover:border-acc/50">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-chip">
              {settings.profile_image_url ? (
                <Image
                  src={settings.profile_image_url}
                  alt="Foto profil Vincent Bryan"
                  fill
                  sizes="200px"
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-hint">
                  <FiUser className="h-10 w-10 opacity-30" />
                  <span className="font-mono text-xs">Foto profil</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <SectionHeading>## tentang-saya</SectionHeading>

            <div className="space-y-3.5 text-base sm:text-[16.5px] leading-relaxed text-prose text-pretty">
              <p>
                Software Developer lulusan Teknik Informatika yang berfokus pada
                pengembangan website modern dan aplikasi mobile. Terbiasa
                menangani sisi frontend (React, Next.js, Tailwind CSS, React
                Native) dan sisi backend (Laravel, REST API, PostgreSQL,
                Supabase) untuk membangun solusi digital yang utuh dari hulu ke
                hilir.
              </p>
              <p>
                Prinsip kerja saya memprioritaskan hasil yang maksimal dengan
                pendekatan minimalis: antarmuka yang bersih, cepat, terstruktur,
                dan intuitif saat digunakan oleh pengguna akhir.
              </p>
              <p>
                Di luar coding, saya aktif sebagai content creator di YouTube
                lewat channel{" "}
                <a
                  href="https://www.youtube.com/@pibichori"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-acc hover:underline inline-flex items-center gap-0.5"
                >
                  <span>PIBI Ch.</span>
                  <FiArrowUpRight className="h-3 w-3" />
                </a>{" "}
                — membagikan video panduan game, tutorial, dan siaran langsung
                santai.
              </p>
            </div>

            {/* Quick Fact Badges */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line-chip bg-panel px-3 py-1 font-mono text-xs text-muted">
                <FiTerminal className="h-3.5 w-3.5 text-acc" />
                <span>Teknik Informatika</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-line-chip bg-panel px-3 py-1 font-mono text-xs text-muted">
                <FiMapPin className="h-3.5 w-3.5 text-success" />
                <span>Indonesia • Remote / On-site</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS & TECH STACK ── */}
      <section
        id="skills"
        className="border-t border-line/80 scroll-mt-16 bg-panel/20"
      >
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <SectionHeading>## skills-&amp;-tech-stack</SectionHeading>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                Teknologi, framework, dan peralatan yang biasa saya gunakan
                dalam produksi.
              </p>
            </div>
            <span className="font-mono text-xs text-hint">
              {tech.length} tech stack yang dikuasai
            </span>
          </div>

          {techByCategory.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {techByCategory.map((cat) => (
                <div
                  key={cat.key}
                  className="flex flex-col rounded-2xl border border-line bg-panel p-5 transition-all hover:border-line-hover hover:shadow-lg hover:shadow-black/20"
                >
                  <div className="font-mono text-xs font-semibold text-muted tracking-wide uppercase border-b border-line/60 pb-2.5 mb-3">
                    <span className="text-acc mr-1.5">{"//"}</span>
                    <span>{cat.label}</span>
                    <span className="text-hint font-normal ml-1">
                      ({cat.items.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map((item) => (
                      <SkillChip key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-8 text-center font-mono text-xs text-hint">
              Belum ada data tech stack di database.
            </div>
          )}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="border-t border-line/80 scroll-mt-16">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <SectionHeading>## projects</SectionHeading>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                Koleksi aplikasi, platform web, dan proyek open-source yang
                telah saya kembangkan.
              </p>
            </div>
            <span className="font-mono text-xs text-hint">
              {projects.length} project yang dibuat
            </span>
          </div>

          {projects.length > 0 ? (
            <ProjectList projects={projects} />
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-12 text-center font-mono text-xs text-hint">
              Belum ada project yang dipublikasikan. Tambahkan melalui panel
              admin.
            </div>
          )}
        </div>
      </section>

      {/* ── YOUTUBE ── */}
      <section
        id="youtube"
        className="border-t border-line/80 scroll-mt-16 bg-panel/20"
      >
        <div className="mx-auto max-w-[1100px] px-6 sm:px-8 py-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <SectionHeading>## youtube — PIBI Ch.</SectionHeading>
              <p className="mt-1 text-xs sm:text-sm text-muted">
                Guide game, ulasan teknologi, dan siaran langsung — ruang kreasi
                konten saya.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@pibichori"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-youtube px-4 py-2 font-mono text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-lg shadow-youtube/20"
            >
              <SiYoutube className="h-4 w-4" />
              <span>Kunjungi Channel</span>
            </a>
          </div>

          {videos.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {videos.map((v) => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-all hover:border-line-hover hover:shadow-xl hover:shadow-black/30"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-chip">
                    <Image
                      src={v.thumbnail}
                      alt={v.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 360px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-youtube text-white shadow-lg">
                        <FiPlay className="h-4 w-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold text-ink group-hover:text-acc transition-colors leading-snug">
                      {v.title}
                    </h3>
                    <div className="mt-auto pt-3 font-mono text-[11px] text-hint">
                      {v.published ? dateFmt.format(new Date(v.published)) : ""}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-line-strong p-8 text-center font-mono text-xs text-hint">
              Belum dapat memuat video terbaru secara otomatis. Silakan kunjungi
              channel YouTube langsung.
            </div>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="border-t border-line/80 scroll-mt-16">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-6 sm:px-8 py-20 md:grid-cols-2">
          {/* Contact Details */}
          <div className="space-y-4">
            <SectionHeading>## contact-me</SectionHeading>
            <p className="text-base leading-relaxed text-body text-pretty">
              Punya ide project menarik, peluang kerja, atau sekadar ingin
              menyapa? Kirimkan pesan melalui form atau hubungi saya langsung
              melalui kontak berikut.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              {[
                {
                  label: "email",
                  value: "vincentbryanid@gmail.com",
                  href: "mailto:vincentbryanid@gmail.com",
                  icon: FiMail,
                },
                {
                  label: "github",
                  value: "github.com/pibich",
                  href: "https://github.com/pibich",
                  icon: SiGithub,
                },
                {
                  label: "linkedin",
                  value: "linkedin.com/in/vincentbryanid",
                  href: "https://linkedin.com/in/vincentbryanid",
                  icon: FaLinkedinIn,
                },
                {
                  label: "youtube",
                  value: "@pibichori",
                  href: "https://www.youtube.com/@pibichori",
                  icon: SiYoutube,
                },
                {
                  label: "whatsapp",
                  value: "+62 859-2063-7925",
                  href: "https://wa.me/6285920637925",
                  icon: SiWhatsapp,
                },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-line bg-panel px-4 py-3 font-mono text-xs text-muted transition-all hover:border-line-hover hover:text-ink hover:bg-chip"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-acc flex-none" />
                      <span className="text-hint">
                        {"// "}
                        {c.label}:
                      </span>
                      <span className="text-ink font-medium">{c.value}</span>
                    </div>
                    <FiArrowUpRight className="h-3.5 w-3.5 text-hint group-hover:text-acc transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8 shadow-xl">
            <h3 className="text-base font-bold text-ink mb-6 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-acc" />
              <span>Kirimkan Pesan Langsung</span>
            </h3>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </div>
  );
}
