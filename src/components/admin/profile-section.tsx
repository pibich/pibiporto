"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  FiCamera,
  FiCheck,
  FiCheckCircle,
  FiDatabase,
  FiHardDrive,
  FiInfo,
  FiLoader,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
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
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = await uploadImage(file, "site-assets");
      const result = await updateProfileImage(url);
      if (!result.ok) {
        setError(result.error ?? "Gagal menyimpan foto profil ke database.");
      } else {
        setSuccess("Foto profil berhasil diperbarui!");
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
    if (!confirm("Hapus foto profil dari homepage?")) return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateProfileImage(null);
      if (result.ok) {
        setSuccess("Foto profil berhasil dihapus.");
        router.refresh();
      } else {
        setError(result.error ?? "Gagal menghapus foto profil.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-xs text-success">
          <FiCheck className="h-4 w-4 flex-none" />
          <span>{success}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h2 className="text-base font-bold text-ink flex items-center gap-2">
          <FiUser className="h-4 w-4 text-acc" />
          <span>Foto Profil Homepage</span>
        </h2>
        <p className="mt-1 text-xs text-muted">
          Foto ini ditampilkan di section “## tentang-saya” pada halaman utama
          portofolio.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar Preview */}
          <div className="relative group">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line-strong bg-chip text-hint transition-all group-hover:border-acc shadow-md">
              {profileImageUrl ? (
                // biome-ignore lint/performance/noImgElement: admin profile picture
                <img
                  src={profileImageUrl}
                  alt="Foto profil"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-hint">
                  <FiUser className="h-8 w-8 opacity-40" />
                  <span className="text-[10px] font-mono">Belum ada foto</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold gap-1"
            >
              <FiCamera className="h-5 w-5" />
              <span>Ganti Foto</span>
            </button>
          </div>

          {/* Action buttons & description */}
          <div className="flex-1 space-y-3">
            <div className="text-xs text-muted leading-relaxed">
              Disarankan menggunakan foto rasio 1:1 (persegi) dengan resolusi
              minimal 400×400 piksel untuk tampilan yang tajam di layar resolusi
              tinggi (Retina).
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-acc px-4 py-2 text-xs font-semibold text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <FiLoader className="h-3.5 w-3.5 animate-spin" />
                    <span>Mengunggah…</span>
                  </>
                ) : (
                  <>
                    <FiCamera className="h-3.5 w-3.5" />
                    <span>
                      {profileImageUrl ? "Ganti Foto" : "Unggah Foto Profil"}
                    </span>
                  </>
                )}
              </button>

              {profileImageUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={pending || uploading}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-danger/35 bg-bg px-3.5 py-2 text-xs font-medium text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                  <span>{pending ? "Menghapus…" : "Hapus Foto"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
        />
      </div>

      {/* System Status & Infrastructure Card */}
      <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
        <h3 className="text-base font-bold text-ink flex items-center gap-2">
          <FiDatabase className="h-4 w-4 text-acc" />
          <span>Status Sistem & Integrasi</span>
        </h3>
        <p className="mt-1 text-xs text-muted">
          Informasi infrastruktur database dan media storage portofolio.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-line/60 bg-bg/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <FiCheckCircle className="h-4 w-4 text-success" />
              <span>Database Supabase</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              PostgreSQL dengan Row-Level Security aktif.
            </p>
          </div>

          <div className="rounded-xl border border-line/60 bg-bg/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <FiHardDrive className="h-4 w-4 text-acc" />
              <span>Storage Buckets</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              Bucket `project-images` & `site-assets` terhubung.
            </p>
          </div>

          <div className="rounded-xl border border-line/60 bg-bg/50 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <FiInfo className="h-4 w-4 text-ink" />
              <span>Sesi Autentikasi</span>
            </div>
            <p className="mt-1 text-[11px] text-muted">
              Sesi terenkripsi 30 hari via `@supabase/ssr`.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
