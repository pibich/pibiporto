import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { getGames, getSettings, getTestimonials } from "@/lib/data";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Boosting Service — Vincent Bryan",
  description:
    "Joki aman & amanah untuk game gacha favoritmu. Progress dikerjakan manual, update berkala via chat.",
};

const DISCORD_URL = "https://discord.gg/WVyTVnRsJ6";

export default async function BoostingPage() {
  const [{ boosting_open: open }, games, testimonials] = await Promise.all([
    getSettings(),
    getGames(),
    getTestimonials(),
  ]);

  const statusColor = open ? "text-success" : "text-danger";
  const statusBorder = open ? "border-success" : "border-danger";
  const statusDot = open ? "bg-success" : "bg-danger";
  const statusText = open ? "OPEN — slot tersedia" : "CLOSED — antrian penuh";
  const ctaNote = open
    ? "respon cepat jam 09.00–22.00 WIB"
    : "sedang tutup, cek lagi nanti";
  const ctaOpacity = open ? "opacity-100" : "opacity-45";

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-[12px]">
        <div className="mx-auto flex h-[60px] max-w-[1080px] items-center justify-between px-7">
          <div className="font-mono text-sm font-semibold">
            <span className="text-acc">~/</span>boosting
          </div>
          <div className="flex items-center gap-[26px]">
            <a
              href="#games"
              className="font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              games
            </a>
            <a
              href="#testimoni"
              className="font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              testimoni
            </a>
            <Link
              href="/"
              className="font-mono text-[12.5px] text-muted transition-colors hover:text-ink"
            >
              ← kembali ke home
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <header className="mx-auto max-w-[720px] px-7 pt-[88px] pb-[72px] text-center">
        <div
          className={`inline-flex items-center gap-[9px] rounded-full border-[1.5px] px-[18px] py-2 font-mono text-[12.5px] font-semibold ${statusColor} ${statusBorder}`}
        >
          <span
            className={`h-[9px] w-[9px] animate-[pulse_1.6s_ease-in-out_infinite] rounded-full ${statusDot}`}
          />
          {statusText}
        </div>
        <h1 className="mt-[22px] text-[48px] font-bold leading-[1.1] tracking-[-0.02em]">
          Boosting Service
        </h1>
        <p className="mx-auto mt-4 max-w-[440px] text-[17px] leading-[1.65] text-body text-pretty">
          Joki aman &amp; amanah untuk game gacha favoritmu. Progress dikerjakan
          manual, update berkala via chat.
        </p>
        <div
          className={`mt-8 flex justify-center gap-[14px] ${ctaOpacity} transition-opacity`}
        >
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-[9px] rounded-lg bg-discord px-6 py-[13px] font-mono text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            <span className="h-2 w-2 rounded-[2px] bg-white" />
            Order via Discord
          </a>
        </div>
        <div className="mt-[14px] font-mono text-[12px] text-hint">
          discord: @iupibi · {ctaNote}
        </div>
      </header>

      {/* ── GAMES ── */}
      <section id="games" className="border-t border-line">
        <div className="mx-auto max-w-[1080px] px-7 py-[72px]">
          <div className="flex items-baseline justify-between">
            <SectionHeading>## games</SectionHeading>
            <span className="font-mono text-[12px] text-hint">
              {games.length} game tersedia · harga via chat
            </span>
          </div>
          {games.length > 0 ? (
            <div className="mt-[26px] grid grid-cols-1 gap-[22px] sm:grid-cols-2 md:grid-cols-3">
              {games.map((g) => (
                <article
                  key={g.id}
                  className="overflow-hidden rounded-[14px] border border-line bg-panel transition-colors hover:border-line-hover"
                >
                  <div className="relative flex h-[140px] w-full items-center justify-center bg-chip font-mono text-[11px] text-hint">
                    {g.image_url ? (
                      <Image
                        src={g.image_url}
                        alt={g.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 340px"
                        className="object-cover"
                      />
                    ) : (
                      g.name
                    )}
                  </div>
                  <div className="px-5 pt-[18px] pb-5">
                    <h3 className="text-[17px] font-semibold">{g.name}</h3>
                    <div className="mt-[10px] flex flex-wrap gap-[6px]">
                      {g.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-[5px] bg-chip px-[9px] py-1 font-mono text-[11px] text-body"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-[26px] font-mono text-[13px] text-hint">
              Belum ada game — tambahkan dari halaman admin.
            </p>
          )}
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section id="testimoni" className="border-t border-line">
        <div className="mx-auto max-w-[1080px] px-7 py-[72px]">
          <div className="flex items-baseline justify-between">
            <SectionHeading>## testimoni</SectionHeading>
            <span className="font-mono text-[12px] text-hint">
              screenshot chat pelanggan · geser →
            </span>
          </div>
          {testimonials.length > 0 ? (
            <div className="mt-[26px] flex gap-[18px] overflow-x-auto pb-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="relative h-[340px] w-[220px] flex-none overflow-hidden rounded-xl border border-line bg-panel"
                >
                  <Image
                    src={t.image_url}
                    alt="Screenshot testimoni pelanggan"
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-[26px] font-mono text-[13px] text-hint">
              Belum ada testimoni — tambahkan dari halaman admin.
            </p>
          )}
        </div>
      </section>

      {/* ── CTA BAWAH ── */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[720px] px-7 pt-16 pb-20 text-center">
          <div className="font-mono text-sm text-muted">
            $ order --game &quot;pilihanmu&quot;
          </div>
          <h2 className="mt-[14px] text-[28px] font-bold">
            Siap naik rank tanpa ribet?
          </h2>
          <p className="mx-auto mt-3 max-w-[400px] text-[15px] leading-[1.6] text-muted">
            Chat dulu untuk cek slot, estimasi waktu, dan harga.
          </p>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-6 inline-flex items-center gap-[9px] rounded-lg bg-discord px-6 py-[13px] font-mono text-[13.5px] font-semibold text-white transition-opacity hover:opacity-85 ${ctaOpacity}`}
          >
            <span className="h-2 w-2 rounded-[2px] bg-white" />
            Order via Discord
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between px-7 py-6">
          <div className="font-mono text-xs text-hint">
            © 2026 Vincent Bryan — bagian dari{" "}
            <Link href="/" className="text-muted hover:text-ink">
              vincent-bryan
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
