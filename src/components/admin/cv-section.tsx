"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import {
  FiCheck,
  FiDownload,
  FiExternalLink,
  FiFileText,
  FiGlobe,
  FiLink,
  FiLoader,
  FiRotateCcw,
  FiUploadCloud,
} from "react-icons/fi";
import { updateCvUrl } from "@/app/admin/actions";
import { uploadFile } from "@/lib/upload";

const DEFAULT_CV_PATH = "/CV_Vincent%20Bryan.pdf";

export function CvSection({ cvUrl }: { cvUrl: string | null }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [customUrl, setCustomUrl] = useState(cvUrl ?? "");
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCvUrl = cvUrl || DEFAULT_CV_PATH;
  const isCustomCv = Boolean(cvUrl && cvUrl !== DEFAULT_CV_PATH);

  async function handleFileUpload(file: File | null) {
    if (!file) return;

    // Validasi ukuran file (maksimal 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError(
        "Ukuran file terlalu besar. Maksimal ukuran file CV adalah 15MB.",
      );
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const publicUrl = await uploadFile(file, "site-assets", "cv");
      const result = await updateCvUrl(publicUrl);
      if (!result.ok) {
        setError(result.error ?? "Gagal menyimpan link CV ke database.");
      } else {
        setCustomUrl(publicUrl);
        setSuccess(`File CV "${file.name}" berhasil diunggah dan diperbarui!`);
        router.refresh();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSaveCustomUrl(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = customUrl.trim();
    if (!trimmed) {
      setError("Masukkan URL CV yang valid atau gunakan opsi reset.");
      return;
    }

    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateCvUrl(trimmed);
      if (result.ok) {
        setSuccess("Tautan CV berhasil disimpan!");
        router.refresh();
      } else {
        setError(result.error ?? "Gagal memperbarui tautan CV.");
      }
    });
  }

  function handleReset() {
    if (!confirm("Kembalikan tautan CV ke file default bawaan website?"))
      return;
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await updateCvUrl(null);
      if (result.ok) {
        setCustomUrl("");
        setSuccess("CV telah dikembalikan ke file bawaan lokal.");
        router.refresh();
      } else {
        setError(result.error ?? "Gagal mereset CV.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-6 sm:p-8">
      {/* Notifications */}
      {error && (
        <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4 text-xs text-success">
          <FiCheck className="h-4 w-4 flex-none" />
          <span>{success}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-line/60 pb-5">
        <div>
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <FiFileText className="h-4 w-4 text-acc" />
            <span>Dokumen CV / Resume</span>
          </h2>
          <p className="mt-1 text-xs text-muted">
            Kelola file atau tautan dokumen CV yang dapat diunduh oleh
            pengunjung di halaman utama.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium border ${
              isCustomCv
                ? "border-acc/40 bg-acc/10 text-acc"
                : "border-line bg-chip text-muted"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isCustomCv ? "bg-acc" : "bg-muted"
              }`}
            />
            {isCustomCv ? "CV Kustom Aktif" : "CV Bawaan (Lokal)"}
          </span>
        </div>
      </div>

      {/* Active CV Preview Box */}
      <div className="mt-6 rounded-xl border border-line/70 bg-bg/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-chip border border-line text-acc">
            <FiFileText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink">
                {isCustomCv ? "Tautan CV Saat Ini" : "File CV Default"}
              </span>
            </div>
            <p className="mt-0.5 truncate font-mono text-[11px] text-muted">
              {activeCvUrl}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={activeCvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line-input bg-panel px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-acc hover:text-acc"
          >
            <FiDownload className="h-3.5 w-3.5" />
            <span>Lihat / Unduh CV</span>
            <FiExternalLink className="h-3 w-3 text-hint" />
          </a>

          {isCustomCv && (
            <button
              type="button"
              onClick={handleReset}
              disabled={pending || uploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-input bg-panel px-3 py-1.5 font-mono text-xs font-medium text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger disabled:opacity-50"
              title="Reset ke file CV default bawaan lokal"
            >
              <FiRotateCcw className="h-3.5 w-3.5" />
              <span>{pending ? "Mereset…" : "Reset Default"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Upload & Link Options */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: Direct File Upload */}
        <div className="rounded-xl border border-line/80 bg-chip/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <FiUploadCloud className="h-4 w-4 text-acc" />
              <span>Unggah File CV Baru</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              Unggah langsung file PDF dari perangkat Anda. File otomatis
              tersimpan di storage cloud Supabase (`site-assets`).
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-line/40">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || pending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-acc px-4 py-2.5 font-mono text-xs font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-50 shadow-sm"
            >
              {uploading ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  <span>Mengunggah File CV…</span>
                </>
              ) : (
                <>
                  <FiUploadCloud className="h-4 w-4" />
                  <span>Pilih File PDF untuk Diunggah</span>
                </>
              )}
            </button>
            <p className="mt-2 text-center text-[11px] text-hint font-mono">
              Format: PDF (Disarankan, maks. 15MB)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* Option 2: External / Cloud URL */}
        <div className="rounded-xl border border-line/80 bg-chip/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-ink">
              <FiLink className="h-4 w-4 text-acc" />
              <span>Atau Tautkan URL Eksternal</span>
            </div>
            <p className="mt-1 text-xs text-muted leading-relaxed">
              Jika CV Anda di-host di Google Drive, Dropbox, Notion, atau link
              lain, tempel tautan langsung di sini.
            </p>
          </div>

          <form
            onSubmit={handleSaveCustomUrl}
            className="mt-5 pt-3 border-t border-line/40 space-y-3"
          >
            <div className="relative">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://drive.google.com/... atau https://..."
                className="w-full rounded-xl border border-line-input bg-bg px-3.5 py-2 pl-9 font-mono text-xs text-ink placeholder:text-hint focus:border-acc focus:outline-none"
              />
              <FiGlobe className="absolute left-3 top-2.5 h-4 w-4 text-hint" />
            </div>

            <button
              type="submit"
              disabled={
                pending ||
                uploading ||
                !customUrl.trim() ||
                customUrl.trim() === cvUrl
              }
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-line-strong bg-panel px-4 py-2 font-mono text-xs font-semibold text-ink transition-all hover:border-acc hover:text-acc disabled:opacity-40 disabled:hover:border-line-strong disabled:hover:text-ink"
            >
              {pending ? (
                <>
                  <FiLoader className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan…</span>
                </>
              ) : (
                <>
                  <FiCheck className="h-3.5 w-3.5" />
                  <span>Simpan Tautan CV</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
