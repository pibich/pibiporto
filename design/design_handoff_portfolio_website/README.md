# Handoff: Portfolio Website — Vincent Bryan

## Overview
Personal portfolio website for **Vincent Bryan — Web Developer · UI/UX Designer · Content Creator**. Dark, developer/terminal-themed site consisting of:

1. **Homepage** — hero, about, skills, projects, YouTube (channel "PIBI Ch."), contact form, footer
2. **Boosting Service page** — game boosting ("joki") service with open/close status, game list, customer-chat testimonials, Discord CTA
3. **Admin Login page** — hidden auth page (not linked from main nav; small "admin" link in footer)
4. **Admin Dashboard** — CRUD for projects so the owner can add/edit/delete portfolio items **without touching code**

Target stack requested by the owner: **Next.js + Tailwind CSS + Supabase** (database + auth + storage). Site language: Bahasa Indonesia.

## About the Design Files
The `.dc.html` files in this bundle are **design references created in HTML** — interactive prototypes showing the intended look and behavior, not production code. Your task is to **recreate these designs in Next.js with Tailwind CSS**, following that codebase's established patterns. Open each `.dc.html` in a browser to inspect the design; all styles are inline on the elements, so exact values can be read directly from the markup.

`image-slot.js` is a prototype-only helper (drag-and-drop image placeholder). In production, replace every `<image-slot>` with a real `<Image>` whose src comes from Supabase Storage (or static assets).

`Wireframe Portofolio.dc.html` shows the earlier low-fi explorations — context only, not a spec.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final. Recreate pixel-perfectly using Tailwind utilities (add the exact hex values to the Tailwind theme).

## Design Tokens
Colors:
- Page background: `#0e1116`
- Card / panel background: `#141920`
- Text primary: `#e6edf3`
- Text secondary: `#a3adb8` (body), `#c4cdd6` (long-form paragraphs)
- Text muted: `#8b949e`; extra-muted / hints: `#565f6b`
- Borders: `rgba(255,255,255,.08)` (default), `.12` (inputs), `.18` (chips), `.25` on card hover
- Accent (primary): `#5ba3f5` — user-tweakable in prototype (alternatives `#3fb96a`, `#a78bfa`, `#f0a84b`); implement as a CSS variable `--acc`
- Success / OPEN: `#3fb96a` · Danger / delete / CLOSED: `#e0645a`
- Discord brand button: `#5865f2` (white text) · YouTube button: `#d33`
- Chip background: `rgba(255,255,255,.06)`

Typography:
- Sans: **IBM Plex Sans** (400/500/600/700) — body text, headings
- Mono: **IBM Plex Mono** (400/500/600) — nav links, section headings (`## nama-section`), labels, chips, buttons, terminal accents
- Load from Google Fonts.
- H1 hero: 56px/1.08, weight 700, letter-spacing -0.02em (Boosting hero: 48px)
- Section heading: mono 15px, weight 600, accent color, written as `## section-name`
- Card title: 19px/600 (project), 17px/600 (game)
- Body: 16.5px/1.75 (about), 14.5px/1.6 (card descriptions)
- Small mono labels: 11–13px

Layout & shape:
- Content max-width: **1080px**, horizontal padding 28px (admin dashboard: 920px; login card: 400px)
- Section vertical padding: 72px; sections separated by 1px top border `rgba(255,255,255,.08)`
- Sticky navbar: height 60px, `rgba(14,17,22,.85)` + `backdrop-filter: blur(12px)`, bottom border
- Radii: cards 14px, panels 12px, inputs/buttons 8px, chips 5–7px, status pill 999px
- Grid gaps: 20–24px
- Smooth anchor scrolling (`scroll-behavior: smooth`)

## Screens / Views

### 1. Homepage (`Portofolio Hi-fi.dc.html`)
Nav (sticky): logo `~/vincent-bryan` (mono, `~/` in accent) left; right links mono 12.5px muted → white on hover: about, skills, projects, youtube, boosting (→ Boosting page), and a solid accent "contact" pill button (dark text).

Hero (`#hero`, padding 96/88): muted mono `$ whoami`; H1 "Vincent Bryan"; **typewriter animation** typing "Web Developer · UI/UX Designer · Content Creator" (mono 19px accent, ~55ms/char, once on load) with a blinking block cursor (9×20px accent, 1.1s step-end infinite); paragraph (max 520px): "Saya membangun website yang sederhana dan enak dipandang — fokus pada detail tampilan, kecepatan, dan pengalaman pengguna."; buttons: solid accent "Lihat Project →" and outlined "Contact Me" (border `rgba(255,255,255,.2)`; hover: accent border+text).

About (`#about`): grid `180px 1fr`, gap 48. Left: 180×180 profile photo, radius 16. Right: heading `## tentang-saya`; two paragraphs (see file for exact copy) covering: simple-design philosophy, HTML/CSS/JS foundation, currently learning Next.js/Tailwind/Supabase, UI/UX design in Figma, and YouTube channel **PIBI Ch.** linked to `https://www.youtube.com/@pibichori`.

Skills (`#skills`): heading `## skills-&-tech-stack`; 3-column grid of panels (bg `#141920`, radius 12, padding 22/24). Each panel: muted mono comment label + chip row (flex, gap 10). Panels: `// fondasi` → HTML, CSS, JavaScript (white chips, border `.18`); `// sedang ditekuni` → Next.js, Tailwind CSS, Supabase (**accent** text+border chips); `// ui-ux design` → Figma, UI/UX Design (white chips).

Projects (`#projects`): heading row: `## projects` + right-aligned muted note "dikelola via halaman admin". 2-column grid, gap 24, of cards (bg `#141920`, radius 14, border-color lightens on hover, .2s): 220px-tall screenshot image (full-bleed top), then padding 22/24: title 19px/600, description 14.5px muted, tech chips (mono 11px on `rgba(255,255,255,.06)`), links row: `demo ↗` (accent, underline on hover) and `repo ↗` (muted). Sample projects (replace with DB data): Landing Page Toko Online (Next.js/Tailwind/Supabase), Company Profile Interaktif (HTML/CSS/JS), Dashboard Manajemen Konten (Next.js/Supabase), Web Overlay Streaming (HTML/CSS/JS). **Data source: Supabase `projects` table, managed from the admin dashboard.**

YouTube (`#youtube`): header row: `## youtube — PIBI Ch.` + subtitle "Guide game & stream santai — sisi lain saya di luar coding." left; red (`#d33`) "Kunjungi Channel" button with white play-triangle → `https://www.youtube.com/@pibichori`. Below: 3-column grid of latest videos — 160px thumbnail (radius 12), title 14px/500, mono muted category. Ideally fetch latest videos via YouTube API/RSS. This whole section is toggleable in the prototype (`showYoutube` prop) — treat as optional section.

Contact (`#contact`): 2-column grid, gap 56. Left: `## contact-me`, invitation paragraph, then mono contact lines — email: `vincenbmainid@gmail.com`, github: `github.com/pibich`, youtube: `@pibichori`. Right: form panel (bg `#141920`, radius 14, padding 26/28) with stacked fields (label mono 11.5px muted; inputs bg `#0e1116`, border `.12`, radius 8, padding 11/14, **focus: accent border**; placeholder `#565f6b`): nama, email, pesan (textarea 4 rows) + full-width accent submit button labeled `$ kirim pesan`. **Success state** replaces form: green mono `$ pesan terkirim ✓`, thank-you line, outlined "kirim lagi" reset button. Wire to email service or Supabase table.

Footer: `© 2026 Vincent Bryan — dibuat dengan Next.js & ☕` left; right links: github (→ `https://github.com/pibich`), youtube (→ channel), and a deliberately dim **admin** link (`#565f6b`) → Admin Login.

### 2. Boosting Service (`Boosting Service.dc.html`)
Route suggestion: `/boosting`. Nav: logo `~/boosting`; links: games, testimoni, `← kembali ke home`.

Hero (centered, max 720px): **status pill** — mono 12.5px/600, 1.5px border, radius 999, colored dot with 1.6s opacity pulse. OPEN: green `#3fb96a`, text "OPEN — slot tersedia", note "respon cepat jam 09.00–22.00 WIB". CLOSED: red `#e0645a`, "CLOSED — antrian penuh", note "sedang tutup, cek lagi nanti", CTA buttons at 45% opacity. **Status must be editable from admin (Supabase settings row), not hardcoded.** H1 "Boosting Service" 48px; subtitle "Joki aman & amanah untuk game gacha favoritmu. Progress dikerjakan manual, update berkala via chat."; Discord-blue button "Order via Discord" → `https://discord.gg/WVyTVnRsJ6` (new tab); mono note `discord: @iupibi · <status note>`.

Games (`#games`): heading + note "6 game tersedia · harga via chat". 3-column grid, gap 22, cards like project cards: 140px key-art image, title 17px/600, service-type chips. Games: Genshin Impact (spiral abyss, eksplorasi, quest), Zenless Zone Zero (shiyu defense, farming), Honkai: Star Rail (memory of chaos, farming), Wuthering Waves (tower of adversity, eksplorasi), Neverness to Everness (story, farming), Arknights: Endfield (story, base building).

Testimoni (`#testimoni`): heading + note "screenshot chat pelanggan · geser →". Horizontal-scroll row (gap 18) of 220×340 chat-screenshot images, radius 12, border `.1`. Owner uploads screenshots via admin/storage.

Bottom CTA (centered, max 720px): mono `$ order --game "pilihanmu"`, H2 28px "Siap naik rank tanpa ribet?", note "Chat dulu untuk cek slot, estimasi waktu, dan harga. No DM = no antri.", Discord button (same link, dims when closed).

Footer: `© 2026 Vincent Bryan — bagian dari vincent-bryan` (link home) · "status dikelola via halaman admin".

### 3. Admin Login (`Admin Login.dc.html`)
Centered column, 400px. Header: mono `$ sudo login` with blinking cursor; H1 "Area Admin" 28px; subtitle "Masuk untuk mengelola portofolio." Panel: email + password fields (same input style), full-width accent "Masuk →" button. Below: muted note "auth via Supabase · halaman ini tidak ditautkan dari homepage" + back link. **Implement with Supabase Auth (email/password, single admin user); protect all admin routes.**

### 4. Admin Dashboard (`Admin Dashboard.dc.html`)
Topbar: `~/admin/projects` left; right: "lihat website ↗" + outlined "logout →". Content (max 920px): header row — H1 "Daftar Project" 26px + mono subtitle "{n} project · perubahan langsung tampil di homepage"; accent "+ Tambah Project" button.

Project list: stacked rows (bg `#141920`, radius 12, padding 16/18, border lightens on hover): 72×48 thumbnail, title 15.5px/600 + mono tech line, mono date (`YYYY-MM`), outlined "edit" button, red-outlined "hapus" button (hover: red 12% bg). Delete removes the row (confirm dialog recommended in production).

Add/Edit modal: overlay `rgba(5,7,10,.7)` + blur(4px), click-outside closes; panel 520px, bg `#141920`, radius 16, padding 28. Title "Tambah Project" / "Edit Project" (edit pre-fills fields) + ✕ close. Fields: judul project; deskripsi singkat (textarea); link demo + link repo (2-col); **tech stack multi-select** — toggleable chip buttons (HTML, CSS, JavaScript, Next.js, Tailwind CSS, Supabase; selected = accent text+border, unselected = muted); screenshot dropzone (dashed border, hover accent, "klik atau drop gambar di sini") → upload to Supabase Storage. Footer: outlined "batal" + accent "simpan". Also add here (not in prototype): a toggle for the Boosting open/close status.

## Interactions & Behavior
- Anchor navigation with smooth scroll; sticky blurred navbars
- Hero typewriter: type tagline once on mount, ~55ms/char; cursor blinks 1.1s step-end infinite forever
- Card hover: border `rgba(255,255,255,.08)` → `.25`, transition .2s; buttons hover: opacity .85; text links: muted → white
- Input focus: border → accent
- Contact form: submit → success state → "kirim lagi" resets
- Boosting status pill dot: opacity pulse 1.6s ease-in-out infinite
- Modal: open via "+ Tambah Project"/"edit"; close via ✕, "batal", or overlay click (content click doesn't propagate)
- All external links (`Discord`, YouTube, GitHub) open in new tab

## State Management / Data
Supabase tables (suggested):
- `projects`: id, title, description, demo_url, repo_url, tech (text[]), image_url, created_at
- `settings`: boosting_open (boolean) — read by Boosting page, toggled in admin
- `messages` (optional): contact-form submissions (or send via email service)
- Games & testimonials can start hardcoded/static; move to tables if the owner wants to manage them from admin later
Auth: Supabase Auth, single admin; middleware-protect `/admin/*`.

## Assets
No final imagery is included — every image in the prototypes is a drag-and-drop placeholder slot. Needed from the owner: profile photo, project screenshots, game key art (6), customer chat screenshots, video thumbnails (or fetch via YouTube API). Fonts: IBM Plex Sans & IBM Plex Mono (Google Fonts).

## Files
- `Portofolio Hi-fi.dc.html` — homepage (hi-fi reference)
- `Boosting Service.dc.html` — boosting page (hi-fi reference)
- `Admin Login.dc.html` — admin login (hi-fi reference)
- `Admin Dashboard.dc.html` — admin dashboard + modal (hi-fi reference)
- `Wireframe Portofolio.dc.html` — earlier wireframes (context only)
- `image-slot.js` — prototype-only image placeholder helper (do not ship)
