"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { updateProfileImage } from "@/app/admin/actions";
import { uploadImage } from "@/lib/upload";

export function ProfileSection({
  profileImageUrl,
}: {
  profileImageUrl: string | null;
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
      const result = await updateProfileImage(url);
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

  function handleRemove() {
    if (!confirm("Hapus foto profil?")) return;
    startTransition(async () => {
      await updateProfileImage(null);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 flex items-center gap-4 rounded-xl border border-line bg-panel px-[18px] py-4">
      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        className="flex h-[72px] w-[72px] flex-none items-center justify-center overflow-hidden rounded-xl border-[1.5px] border-dashed border-line-strong bg-chip text-[9px] text-hint transition-colors hover:border-acc"
      >
        {profileImageUrl ? (
          // biome-ignore lint/performance/noImgElement: admin thumbnail
          <img
            src={profileImageUrl}
            alt="foto profil"
            className="h-full w-full object-cover"
          />
        ) : (
          "foto"
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] text-ink">foto profil</div>
        <div className="mt-1 text-[11.5px] text-muted">
          tampil di section “tentang-saya” homepage
        </div>
        {error && <div className="mt-1 text-[11.5px] text-danger">{error}</div>}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="rounded-md border border-line-input px-[13px] py-[7px] text-[12px] text-muted transition-colors hover:border-line-hover hover:text-ink disabled:opacity-60"
        >
          {uploading ? "mengunggah…" : profileImageUrl ? "ganti" : "unggah"}
        </button>
        {profileImageUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={pending}
            className="rounded-md border border-danger/35 px-[13px] py-[7px] text-[12px] text-danger transition-colors hover:bg-danger/12"
          >
            hapus
          </button>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
