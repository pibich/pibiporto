This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Kategori Skill (tech-stack)

Setiap item tech-stack punya satu dari kategori berikut. Opsi kategorinya muncul
di form admin (`+ tambah tech`) dan menentukan kartu mana yang menampilkannya di
section `## skills-&-tech-stack` homepage.

| Kategori  | Isi (contoh)                                          |
| --------- | ----------------------------------------------------- |
| frontend  | HTML, CSS, JavaScript, TypeScript, React, Next.js, Tailwind CSS |
| backend   | PHP, Laravel, REST API                                |
| database  | MySQL, PostgreSQL                                     |
| baas      | Supabase, Firebase                                    |
| mobile    | Kotlin (Android Studio), React Native                 |
| tools     | Git, GitHub, VS Code, Figma, phpMyAdmin               |
| lainnya   | Python, Java, C++, UI/UX Design                       |

Kode terkait:

- `src/lib/types.ts` — union `TechCategory` (harus sama dengan constraint DB)
- `src/lib/tech.ts` — `TECH_CATEGORIES`, urutan & label yang tampil
- `supabase/tech_stack.sql` — skema tabel + data awal
- `supabase/tech-categories.sql` — migrasi database lama (foundation/learning/design → kategori baru)

Database yang sudah berjalan: jalankan `supabase/tech-categories.sql` sekali di
Supabase SQL Editor. Database baru tidak perlu — `tech_stack.sql` sudah memakai
kategori baru.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
