"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { createTestimonial, deleteTestimonial } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/types";
import { uploadImage } from "@/lib/upload";

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      const result = await createTestimonial(url);
      if (!result.ok) {
        setError(result.error ?? "Gagal menyimpan.");
      } else {
        router.refresh();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function handleDelete(t: Testimonial) {
    if (!confirm("Hapus screenshot testimoni ini?")) return;
    startTransition(async () => {
      await deleteTestimonial(t.id);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 rounded-xl border border-line bg-panel px-[18px] py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[13px] text-ink">
            testimoni (screenshot)
          </div>
          <div className="mt-1 font-mono text-[11.5px] text-muted">
            {testimonials.length} screenshot · tampil di halaman /boosting
          </div>
        </div>
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-acc px-[14px] py-[8px] font-mono text-[12px] font-semibold text-acc transition-opacity hover:opacity-85 disabled:opacity-60"
        >
          {uploading ? "mengunggah…" : "+ Tambah Screenshot"}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && (
        <div className="mt-3 font-mono text-[12px] text-danger">{error}</div>
      )}

      {testimonials.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="group relative h-[140px] w-[92px] overflow-hidden rounded-lg border border-line"
            >
              {/* biome-ignore lint/performance/noImgElement: admin thumbnail */}
              <img
                src={t.image_url}
                alt="testimoni"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleDelete(t)}
                disabled={pending}
                className="absolute right-[6px] top-[6px] rounded-md bg-[rgba(5,7,10,0.75)] px-[8px] py-[4px] font-mono text-[10px] text-danger opacity-0 transition-opacity hover:bg-[rgba(5,7,10,0.9)] group-hover:opacity-100"
              >
                hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
