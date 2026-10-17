# Vincent Bryan — Portfolio Website

Website portofolio personal milik **Vincent Bryan** yang dirancang dengan estetika minimalis bernuansa terminal developer. Website ini menampilkan rekam jejak proyek website & mobile, daftar keahlian teknologi, integrasi video YouTube, serta dilengkapi panel admin dinamis untuk mengelola konten secara langsung.

---

## Fungsi Utama Proyek

1. **Showcase Portofolio Proyek:** Menampilkan katalog karya proyek lengkap dengan deskripsi, teknologi yang digunakan, tautan live demo, repositori GitHub, dan halaman detail dokumentasi teknis (Markdown / sinkronisasi otomatis dari README GitHub).
2. **Katalog Tech Stack & Skills:** Menampilkan daftar keahlian teknis yang dikelompokkan secara terstruktur (Frontend, Backend, Database, BaaS, Mobile, Tools, Lainnya) dengan ikon brand otomatis dari Simple Icons.
3. **Formulir Kontak Terintegrasi:** Memungkinkan pengunjung mengirim pesan secara langsung. Pesan disimpan ke database Supabase dan diteruskan otomatis ke email pemilik melalui layanan Resend.
4. **Feed YouTube Terkini:** Menampilkan video terbaru dari channel YouTube **PIBI Ch.** secara dinamis.
5. **Panel Admin Terlindungi (`/admin`):** Dashboard manajemen konten yang aman untuk menambah, menyunting, dan menghapus proyek, skill tech stack, foto profil homepage, serta meninjau pesan kontak yang masuk.

---

## Tech Stack yang Digunakan

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server Components & Server Actions)
* **Library UI:** [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
* **Styling & Desain:** [Tailwind CSS v4](https://tailwindcss.com/) dengan palet dark-mode kustom
* **Database & Autentikasi:** [Supabase](https://supabase.com/) (PostgreSQL dengan Row-Level Security ketat & Supabase Auth)
* **Media Storage:** [Supabase Storage](https://supabase.com/storage) (Bucket `project-images` & `site-assets`)
* **Layanan Email:** [Resend](https://resend.com/) (Notifikasi pesan kontak)
* **Pemotong Gambar:** [react-easy-crop](https://github.com/ValentinH/react-easy-crop) (Crop visual 16:9 HD sebelum upload)
* **Dokumentasi Markdown:** [react-markdown](https://github.com/remarkjs/react-markdown) & [remark-gfm](https://github.com/remarkjs/remark-gfm)
* **Linter & Formatter:** [Biome](https://biomejs.dev/)

---

## Cara Menjalankan Proyek

1. **Instal dependensi:**
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variables:**
   Salin file `.env.example` menjadi `.env.local` dan isi kredensial Supabase serta Resend Anda:
   ```bash
   cp .env.example .env.local
   ```

3. **Inisialisasi Database Supabase:**
   Jalankan seluruh isi query pada file [`supabase/schema.sql`](./supabase/schema.sql) di Supabase Dashboard → SQL Editor.

4. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

5. **Akses Dashboard Admin:**
   Kunjungi [http://localhost:3000/admin](http://localhost:3000/admin) (akan diarahkan ke `/login` untuk memasukkan akun admin Supabase Anda).

---

> Dokumen spesifikasi teknis dan arsitektur mendalam tersedia pada [PRD.md](./PRD.md).
