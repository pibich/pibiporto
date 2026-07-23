import Image from "next/image";
import type { IconType } from "react-icons";
import { LuPenTool } from "react-icons/lu";
import {
  SiCss,
  SiFigma,
  SiHtml5,
  SiJavascript,
  SiNextdotjs,
  SiSupabase,
  SiTailwindcss,
} from "react-icons/si";
import { ContactForm } from "@/components/contact-form";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { getProjects, getSettings } from "@/lib/data";
import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 0; // always reflect the latest admin changes

const foundation = ["HTML", "CSS", "JavaScript"];
const learning = ["Next.js", "Tailwind CSS", "Supabase"];
const design = ["Figma", "UI/UX Design"];

const chipBase =
  "inline-flex items-center gap-[7px] rounded-[7px] px-[14px] py-[7px] font-mono text-[13px] transition-colors";

// Brand icon + accent colour per skill. currentColor lets monochrome logos
// (Next.js, the design pen) inherit the chip's text colour.
const skillIcons: Record<string, { Icon: IconType; color: string }> = {
  HTML: { Icon: SiHtml5, color: "#E34F26" },
  CSS: { Icon: SiCss, color: "#1572B6" },
  JavaScript: { Icon: SiJavascript, color: "#F7DF1E" },
  "Next.js": { Icon: SiNextdotjs, color: "currentColor" },
  "Tailwind CSS": { Icon: SiTailwindcss, color: "#38BDF8" },
  Supabase: { Icon: SiSupabase, color: "#3FCF8E" },
  Figma: { Icon: SiFigma, color: "#F24E1E" },
  "UI/UX Design": { Icon: LuPenTool, color: "currentColor" },
};

function SkillChip({
  name,
  accent = false,
}: {
  name: string;
  accent?: boolean;
}) {
  const entry = skillIcons[name];
  const Icon = entry?.Icon;
  return (
    <span
      className={`${chipBase} border ${
        accent ? "border-acc font-medium text-acc" : "border-line-chip text-ink"
      }`}
    >
      {Icon && (
        <Icon size={15} color={entry.color} className="flex-none" aria-hidden />
      )}
      {name}
    </span>
  );
}

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function Home() {
  const [projects, settings, videos] = await Promise.all([
    getProjects(),
    getSettings(),
    getLatestVideos(3),
  ]);

  return (
    <>
      <SiteNav />

      <Hero />

      {/* ── ABOUT ── */}
      <section id="about" className="border-t border-line">
        <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-12 px-7 py-[72px] sm:grid-cols-[180px_1fr]">
          <div className="relative flex h-[180px] w-[180px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-panel font-mono text-[11px] text-hint">
            {settings.profile_image_url ? (
              <Image
                src={settings.profile_image_url}
                alt="Foto profil Vincent Bryan"
                fill
                sizes="180px"
                className="object-cover"
              />
            ) : (
              "Foto profil"
            )}
          </div>
          <div>
            <SectionHeading>## tentang-saya</SectionHeading>
            <p className="mt-[18px] max-w-[640px] text-[16.5px] leading-[1.75] text-prose text-pretty">
              Halo! Saya Vincent, seorang Website Developer yang percaya bahwa
              desain terbaik adalah yang sederhana. Berbekal HTML, CSS, dan
              JavaScript, saat ini saya menekuni Next.js dengan Tailwind CSS dan
              Supabase untuk membangun aplikasi web modern yang cepat dan rapi.
              Sebagai UI/UX Designer, saya merancang antarmuka di Figma sebelum
              menuangkannya ke dalam kode.
            </p>
            <p className="mt-[14px] max-w-[640px] text-[16.5px] leading-[1.75] text-prose text-pretty">
              Di luar coding, saya aktif sebagai content creator di YouTube
              lewat channel{" "}
              <a
                href="https://www.youtube.com/@pibichori"
                target="_blank"
                rel="noopener noreferrer"
                className="text-acc"
              >
                PIBI Ch.
              </a>{" "}
              — berbagi guide game dan stream santai.
            </p>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="border-t border-line">
        <div className="mx-auto max-w-[1080px] px-7 py-[72px]">
          <SectionHeading>## skills-&amp;-tech-stack</SectionHeading>
          <div className="mt-[26px] grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="rounded-xl border border-line bg-panel px-6 py-[22px]">
              <div className="font-mono text-[12px] text-muted">
                {"// fondasi"}
              </div>
              <div className="mt-[14px] flex flex-wrap gap-[10px]">
                {foundation.map((s) => (
                  <SkillChip key={s} name={s} />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-line bg-panel px-6 py-[22px]">
              <div className="font-mono text-[12px] text-muted">
                {"// sedang ditekuni"}
              </div>
              <div className="mt-[14px] flex flex-wrap gap-[10px]">
                {learning.map((s) => (
                  <SkillChip key={s} name={s} accent />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-line bg-panel px-6 py-[22px]">
              <div className="font-mono text-[12px] text-muted">
                {"// ui-ux design"}
              </div>
              <div className="mt-[14px] flex flex-wrap gap-[10px]">
                {design.map((s) => (
                  <SkillChip key={s} name={s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="border-t border-line">
        <div className="mx-auto max-w-[1080px] px-7 py-[72px]">
          <SectionHeading>## projects</SectionHeading>
          {projects.length > 0 ? (
            <div className="mt-[26px] grid grid-cols-1 gap-6 md:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <p className="mt-[26px] font-mono text-[13px] text-hint">
              Belum ada project — tambahkan dari halaman admin.
            </p>
          )}
        </div>
      </section>

      {/* ── YOUTUBE ── */}
      <section id="youtube" className="border-t border-line">
        <div className="mx-auto max-w-[1080px] px-7 py-[72px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <SectionHeading>## youtube — PIBI Ch.</SectionHeading>
              <p className="mt-[10px] text-[15px] text-muted">
                Guide game &amp; stream santai — sisi lain saya di luar coding.
              </p>
            </div>
            <a
              href="https://www.youtube.com/@pibichori"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-youtube px-[18px] py-[10px] font-mono text-[12.5px] font-semibold text-white transition-opacity hover:opacity-85"
            >
              <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-white" />
              Kunjungi Channel
            </a>
          </div>
          {videos.length > 0 ? (
            <div className="mt-[26px] grid grid-cols-1 gap-5 sm:grid-cols-3">
              {videos.map((v) => (
                <a
                  key={v.id}
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative h-[160px] w-full overflow-hidden rounded-xl border border-line bg-panel transition-colors group-hover:border-line-hover">
                    <Image
                      src={v.thumbnail}
                      alt={v.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 336px"
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-[10px] text-sm font-medium leading-[1.4] transition-colors group-hover:text-acc">
                    {v.title}
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-hint">
                    {v.published ? dateFmt.format(new Date(v.published)) : ""}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-[26px] font-mono text-[13px] text-hint">
              Belum bisa memuat video — kunjungi channel langsung.
            </p>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="border-t border-line">
        <div className="mx-auto grid max-w-[1080px] grid-cols-1 gap-14 px-7 pt-[72px] pb-[88px] md:grid-cols-2">
          <div>
            <SectionHeading>## contact-me</SectionHeading>
            <p className="mt-[18px] text-[16.5px] leading-[1.7] text-prose text-pretty">
              Punya ide project atau ingin berkolaborasi? Kirim pesan — saya
              akan balas secepatnya.
            </p>
            <div className="mt-[26px] flex flex-col gap-[10px]">
              <div className="font-mono text-[13px] text-muted">
                <span className="text-hint">email:</span>{" "}
                vincentbryanid@gmail.com
              </div>
              <div className="font-mono text-[13px] text-muted">
                <span className="text-hint">github:</span> github.com/pibich
              </div>
              <div className="font-mono text-[13px] text-muted">
                <span className="text-hint">youtube:</span> @pibichori
              </div>
            </div>
          </div>
          <div className="rounded-[14px] border border-line bg-panel px-7 py-[26px]">
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
