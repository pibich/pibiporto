import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { BackToTop } from "@/components/back-to-top";
import { CursorGlow } from "@/components/cursor-glow";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vincent Bryan — Web Developer · UI/UX Designer · Content Creator",
  description:
    "Portofolio Vincent Bryan — website sederhana dan enak dipandang, fokus pada detail tampilan, kecepatan, dan pengalaman pengguna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${jakarta.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink">
        {children}
        <CursorGlow />
        <BackToTop />
      </body>
    </html>
  );
}
