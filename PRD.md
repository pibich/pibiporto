# Product Requirement Document (PRD) — Portofolio Website

Dokumen ini merupakan panduan spesifikasi arsitektur, basis data, dan fitur untuk website portofolio personal **Vincent Bryan**. Digunakan sebagai acuan utama dalam pengembangan, pemeliharaan, dan penambahan fitur berikutnya.

---

## 1. Ringkasan & Tujuan Proyek

* **Pemilik Proyek:** Vincent Bryan (Software Developer & Content Creator).
* **Tujuan Utama:** 
  1. Menampilkan keahlian teknis, rekam jejak proyek website & mobile, serta aktivitas konten secara profesional dengan identitas visual minimalis bernuansa terminal developer.
  2. Menyediakan panel admin yang aman, intuitif, dan responsif untuk mengelola seluruh konten website (proyek, keahlian/tech stack, foto profil, dan pesan kontak) secara langsung tanpa perlu menyunting kode sumber.
  3. Memastikan kinerja maksimal, aksesibilitas tinggi, dan integrasi otomatis dengan ekosistem luar (GitHub README sync, YouTube RSS/API, Supabase Storage & Database, Resend Email).

---

## 2. Tech Stack & Arsitektur Sistem

| Komponen | Teknologi | Deskripsi / Catatan |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | Server Components, Server Actions (`"use server"`), React Compiler (`babel-plugin-react-compiler`). |
| **Runtime & Lib** | **React 19 & TypeScript 5** | Strict typing, hooks modern (`useActionState`, `useTransition`, dll). |
| **Styling** | **Tailwind CSS v4** | Dark mode native, custom tokens (`--color-bg`, `--color-panel`, `--color-acc`), font Plus Jakarta Sans & IBM Plex Mono. |
| **Database & Auth** | **Supabase (PostgreSQL)** | Autentikasi sesi via `@supabase/ssr`, cookie management, Row-Level Security (RLS) ketat. |
| **Media Storage** | **Supabase Storage** | Bucket publik: `project-images` (16:9 HD cropped) dan `site-assets` (foto profil). |
| **Komunikasi** | **Resend** | Mengirimkan notifikasi email otomatis saat ada pesan kontak masuk. |
| **Ikonografi** | **react-icons & Simple Icons CDN** | Feather Icons (`react-icons/fi`) untuk UI admin & website, CDN Simple Icons untuk brand logo skill. |
| **Dokumentasi** | **react-markdown & remark-gfm** | Merender dokumentasi proyek format Markdown dengan dukungan tabel, list, dan link. |
| **Image Tool** | **react-easy-crop** | Memotong gambar secara visual di browser ke rasio 16:9 (1920×1080) sebelum diunggah. |
| **Linter & Formatter** | **Biome 2** | Pengganti ESLint & Prettier dengan eksekusi cepat dan aturan aksesibilitas (a11y) ketat. |

---

## 3. Spesifikasi Database & Supabase Storage

Skema database lengkap dikonsolidasikan pada [`supabase/schema.sql`](./supabase/schema.sql) dan telah lolos uji **Supabase Database Linter** (bebas dari warning `0024_permissive_rls_policy` dan `0025_public_bucket_allows_listing`).

### 3.1 Tabel Database

1. **`public.projects`**
   * Menyimpan portofolio proyek.
   * **Kolom:** `id` (UUID, PK), `title` (text, NOT NULL), `slug` (text, UNIQUE), `description` (text), `demo_url` (text), `repo_url` (text), `tech` (text[]), `image_url` (text), `documentation` (text), `doc_source` (text, CHECK in `'manual'`, `'github'`, `'none'`), `show_description` (boolean, default true), `created_at` (timestamptz).
   * **RLS:**
     * `SELECT`: Terbuka untuk umum (`USING (true)`).
     * `INSERT / UPDATE / DELETE`: Hanya untuk `authenticated` (`USING (auth.uid() is not null)`).

2. **`public.tech_stack`**
   * Menyimpan daftar keahlian & teknologi yang tampil di homepage dan modal pilihan tech.
   * **Kolom:** `id` (UUID, PK), `name` (text, NOT NULL), `category` (text, CHECK in `'frontend'`, `'backend'`, `'database'`, `'baas'`, `'mobile'`, `'tools'`, `'lainnya'`), `icon_slug` (text), `color` (text), `sort_order` (integer), `created_at` (timestamptz).
   * **RLS:**
     * `SELECT`: Terbuka untuk umum (`USING (true)`).
     * `INSERT / UPDATE / DELETE`: Hanya untuk `authenticated` (`USING (auth.uid() is not null)`).

3. **`public.settings`**
   * Singleton row (`id = true`) untuk menyimpan konfigurasi visual situs (saat ini foto profil homepage).
   * **Kolom:** `id` (boolean, PK), `profile_image_url` (text), `updated_at` (timestamptz).
   * **RLS:**
     * `SELECT`: Terbuka untuk umum (`USING (true)`).
     * `UPDATE`: Hanya untuk `authenticated` (`USING (auth.uid() is not null)`).

4. **`public.messages`**
   * Menyimpan pesan yang dikirim pengunjung melalui formulir kontak.
   * **Kolom:** `id` (UUID, PK), `name` (text, NOT NULL), `email` (text, NOT NULL), `message` (text, NOT NULL), `created_at` (timestamptz).
   * **RLS:**
     * `INSERT`: Anonim & Authenticated dengan validasi ketat anti-spam: panjang nama <= 150, email <= 255, pesan <= 10000, dan tidak boleh kosong.
     * `SELECT / DELETE`: Hanya untuk `authenticated` (`USING (auth.uid() is not null)`).

### 3.2 Supabase Storage Buckets
* **`project-images`:** Menyimpan screenshot atau poster proyek (Public = true).
* **`site-assets`:** Menyimpan foto profil pemilik portofolio (Public = true).
* **Kebijakan Akses:**
  * File gambar dapat diakses langsung oleh publik melalui endpoint URL publik `/storage/v1/object/public/...`.
  * Pembacaan daftar objek (`SELECT`) dan manipulasi file (`INSERT`, `UPDATE`, `DELETE`) dibatasi hanya untuk role `authenticated`.

---

## 4. Fitur & Struktur Modul

### 4.1 Modul Halaman Publik (Public View)
1. **Navigasi Atas (`SiteNav`):**
   * Sticky navbar berlatar blur dengan logo terminal `~/vincent-bryan`, indikator ketersediaan kerja beranimasi (pulsing green dot), tautan navigasi anchor (`#about`, `#skills`, `#projects`, `#youtube`), CTA `Hubungi Saya`, dan menu seluler responsif.
2. **Hero Section (`Hero`):**
   * Terminal prompt `$ whoami`, tipografi nama besar, animasi efek ketik (typewriter) bergantian untuk role keahlian, tombol unduh CV PDF, CTA project, dan tautan sosial (GitHub, LinkedIn, YouTube, WhatsApp).
3. **Tentang Saya (`#about`):**
   * Foto profil bersudut rounded dengan border halus, ringkasan latar belakang pendidikan Teknik Informatika, fokus pengembangan sistem, dan tautan channel YouTube.
4. **Skills & Tech Stack (`#skills`):**
   * Dikelompokkan rapi ke dalam 7 kategori. Masing-masing item menampilkan ikon brand SVG (Simple Icons) otomatis atau kustom.
5. **Daftar Proyek (`#projects` & `ProjectCard`):**
   * Tampilan kartu proyek berasio 16:9 dengan hover zoom, label teknologi, serta tautan langsung ke Live Demo, Repositori GitHub, dan Halaman Detail.
6. **Halaman Detail Proyek (`/projects/[slug]`):**
   * Menampilkan dokumentasi teknis mendalam format Markdown.
   * Mendukung auto-fetch sinkronisasi langsung dari file `README.md` repositori GitHub publik/privat (dengan fallback salinan tersimpan).
7. **YouTube Feed (`#youtube`):**
   * Menampilkan 3 video terbaru dari channel YouTube **PIBI Ch.** secara dinamis dengan thumbnail dan tautan tontonan.
8. **Form Kontak (`#contact` & `ContactForm`):**
   * Formulir pengiriman pesan langsung dengan validasi client/server, penyimpanan ke tabel `messages`, dan pengiriman notifikasi email latar belakang melalui Resend.
9. **Footer (`SiteFooter`):**
   * Hak cipta tahun dinamis, tautan sosial, dan jalan pintas tersembunyi menuju panel admin (`/login`).

### 4.2 Modul Panel Administrator (Admin Dashboard)
1. **Autentikasi & Guard (`/login` & `proxy.ts`):**
   * Halaman login bertema terminal dengan toggle intip kata sandi.
   * Middleware proxy menjaga rute `/admin/*`; pengguna yang belum terautentikasi otomatis dialihkan ke `/login`.
   * Cookie sesi disetel dengan `httpOnly: false` agar browser client `@supabase/ssr` dapat membaca token untuk upload media ke Supabase Storage.
2. **Kelola Proyek (`/admin`):**
   * Kartu metrik ringkasan (Total, Live Demo, Repo GitHub, Dokumentasi Aktif).
   * Toolbar pencarian live dan tombol filter status.
   * Modal pembuatan & penyuntingan proyek berstruktur 4 tab:
     * *Tab 1 (Informasi):* Judul, deskripsi singkat, toggle tampilkan deskripsi, tautan demo & repo, serta tombol impor otomatis dari GitHub API.
     * *Tab 2 (Tech Stack):* Pemilih teknologi interaktif dengan pencarian.
     * *Tab 3 (Dokumentasi):* Pilihan mode (GitHub README, Tulis Manual, Nonaktif) dan editor Markdown dengan pratinjau langsung.
     * *Tab 4 (Screenshot):* Area dropzone upload dengan dialog pemotong gambar rasio 16:9.
   * Dialog konfirmasi hapus proyek yang aman dan ramah pengguna.
3. **Kelola Tech Stack (`/admin/tech`):**
   * Pencarian instan dan tab filter kategori.
   * Modal tambah/edit dengan pratinjau live ikon Simple Icons dan palet warna preset.
   * Toolbar aksi massal (*bulk actions*) untuk memindahkan kategori atau menghapus beberapa teknologi sekaligus.
4. **Pesan Masuk (`/admin/messages`):**
   * Menampilkan daftar kontak masuk dari pengunjung website.
   * Tombol pintas balas cepat via email (`mailto:`) dan hapus pesan.
5. **Profil & Pengaturan (`/admin/profile`):**
   * Manajemen foto profil homepage dengan preview besar dan opsi ganti/hapus foto.
   * Pemantau status infrastruktur database dan storage bucket.

---

## 5. Konfigurasi Environment Variables (`.env.local`)

Salin dari `.env.example` dan pastikan variabel-variabel berikut telah terisi:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...

# Email Notification via Resend (Digunakan pada form kontak)
RESEND_API_KEY=re_...
CONTACT_NOTIFICATION_EMAIL=admin@email.com

# GitHub Integration (Opsional, untuk mengakses README pada repositori private)
GITHUB_TOKEN=ghp_...

# YouTube Data API v3 (Opsional, fallback otomatis menggunakan RSS Feed publik)
YOUTUBE_API_KEY=AIzaSy...
```

---

## 6. Standar Pengembangan & Panduan Pemeliharaan

1. **Aturan Cookie Autentikasi:**
   * Di file [`src/lib/supabase/cookie-options.ts`](./src/lib/supabase/cookie-options.ts), opsi `httpOnly` **harus selalu bernilai `false`**. Jangan mengubahnya menjadi `true`, karena browser client `@supabase/ssr` membutuhkan akses `document.cookie` untuk menyertakan token JWT saat mengunggah media langsung dari browser ke Supabase Storage.
2. **Keamanan Row-Level Security (RLS):**
   * Hindari penulisan `USING (true)` atau `WITH CHECK (true)` pada query operasi tulis (`INSERT`, `UPDATE`, `DELETE`). Gunakan selalu `(auth.uid() is not null)` atau validasi konten kolom agar database tetap lolos audit keamanan Supabase Linter (0024).
3. **Penyimpanan Media & Storage:**
   * Jangan pernah mengizinkan broad public `SELECT` pada tabel `storage.objects` untuk bucket publik (patuhi linter 0025). Cukup setel status bucket ke `public = true`, dan file dapat langsung disajikan melalui URL publik tanpa mengekspos listing isi bucket ke pengguna umum.
4. **Kualitas & Format Kode:**
   * Selalu jalankan `npm run lint` dan `npm run format` (Biome) serta `npm run build` sebelum melakukan commit kode untuk memastikan tidak ada kesalahan kompilasi atau peringatan aksesibilitas.
