"use client";

import { useEffect, useRef, useState } from "react";
import {
  createProject,
  importFromGitHub,
  type ProjectInput,
  updateProject,
} from "@/app/admin/actions";
import { ImageCropper } from "@/components/admin/image-cropper";
import { Markdown } from "@/components/markdown";
import type { DocSource, Project } from "@/lib/types";
import { uploadImage } from "@/lib/upload";

const inputClass =
  "rounded-lg border border-line-input bg-bg px-[14px] py-[11px] font-sans text-[14.5px] text-ink outline-none focus:border-acc";
const labelClass = "text-[11.5px] text-muted";

export function ProjectModal({
  project,
  techOptions,
  onClose,
  onSaved,
}: {
  project: Project | null;
  techOptions: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!project;
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [showDescription, setShowDescription] = useState(
    project?.show_description ?? true,
  );
  const [demoUrl, setDemoUrl] = useState(project?.demo_url ?? "");
  const [repoUrl, setRepoUrl] = useState(project?.repo_url ?? "");
  const [tech, setTech] = useState<string[]>(project?.tech ?? []);
  const [documentation, setDocumentation] = useState(
    project?.documentation ?? "",
  );
  const [docSource, setDocSource] = useState<DocSource>(
    project?.doc_source ?? "manual",
  );
  const [showPreview, setShowPreview] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    project?.image_url ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Close on Escape for keyboard accessibility.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleTech(name: string) {
    setTech((cur) =>
      cur.includes(name) ? cur.filter((t) => t !== name) : [...cur, name],
    );
  }

  function pickFile(f: File | null) {
    if (!f) return;
    setOriginalFile(f);
    setCropSrc(URL.createObjectURL(f));
  }

  function handleCropConfirm(f: File) {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setCropSrc(null);
  }

  function reopenCrop() {
    if (originalFile) setCropSrc(URL.createObjectURL(originalFile));
  }

  async function handleImportGitHub() {
    if (!repoUrl.trim()) {
      setError("Isi link repo dulu, lalu klik impor.");
      return;
    }
    setImporting(true);
    setError(null);
    const result = await importFromGitHub(repoUrl);
    setImporting(false);
    if (!result.ok || !result.data) {
      setError(result.error ?? "Gagal mengimpor dari GitHub.");
      return;
    }
    const { title: t, description: d, tech: imported } = result.data;
    if (t) setTitle(t);
    if (d) setDescription(d);
    setTech((prev) => [...new Set([...prev, ...imported])]);
    // project baru: dokumentasi langsung diambil dari README
    if (!isEdit) setDocSource("github");
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Judul wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const image_url = file
        ? await uploadImage(file, "project-images")
        : (project?.image_url ?? null);
      const payload: ProjectInput = {
        title,
        description,
        demo_url: demoUrl,
        repo_url: repoUrl,
        tech,
        image_url,
        documentation,
        doc_source: docSource,
        show_description: showDescription,
      };
      const result = project
        ? await updateProject(project.id, payload)
        : await createProject(payload);
      if (!result.ok) {
        setError(result.error ?? "Gagal menyimpan.");
        setSaving(false);
        return;
      }
      onSaved();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      {/* Backdrop — a real button so click-to-close is keyboard-accessible */}
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(5,7,10,0.7)]"
      />
      <div className="relative max-h-[90vh] w-[520px] max-w-full overflow-auto rounded-2xl border border-line-input bg-panel p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-bold">
            {isEdit ? "Edit Project" : "Tambah Project"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            tutup
          </button>
        </div>

        <div className="mt-[22px] flex flex-col gap-[14px]">
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass} htmlFor="p-title">
              judul project
            </label>
            <input
              id="p-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nama project"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center justify-between">
              <label className={labelClass} htmlFor="p-desc">
                deskripsi singkat
              </label>
              <button
                type="button"
                onClick={() => setShowDescription((v) => !v)}
                className={`text-[11px] transition-colors ${
                  showDescription
                    ? "text-acc hover:opacity-80"
                    : "text-hint hover:text-muted"
                }`}
              >
                {showDescription ? "● aktif" : "○ nonaktif"}
              </button>
            </div>
            {showDescription ? (
              <textarea
                id="p-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi 1-2 kalimat…"
                className={`${inputClass} resize-y`}
              />
            ) : (
              <span className="rounded-lg border border-line-input bg-bg px-[14px] py-3 text-[12px] text-hint">
                Deskripsi dinonaktifkan: tidak ditampilkan di kartu maupun
                halaman detail. Teksnya tetap tersimpan.
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-[6px]">
              <label className={labelClass} htmlFor="p-demo">
                link demo
              </label>
              <input
                id="p-demo"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://…"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className={labelClass} htmlFor="p-repo">
                link repo
              </label>
              <input
                id="p-repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/…"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-[10px]">
            <button
              type="button"
              onClick={handleImportGitHub}
              disabled={importing || saving}
              className="rounded-md border border-line-input px-[13px] py-[7px] text-[12px] text-muted transition-colors hover:border-line-hover hover:text-ink disabled:opacity-60"
            >
              {importing ? "mengimpor…" : "impor dari GitHub ↗"}
            </button>
            <span className="text-[11px] text-hint">
              isi judul, deskripsi &amp; tech stack otomatis dari repo
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>tech stack</span>
            <div className="flex flex-wrap gap-2">
              {techOptions.length === 0 && (
                <span className="text-[11.5px] text-hint">
                  Belum ada tech, tambahkan dulu di daftar tech-stack.
                </span>
              )}
              {/* include any tech already on the project even if it was later removed from the list */}
              {[...new Set([...techOptions, ...tech])].map((name) => {
                const on = tech.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleTech(name)}
                    className={`rounded-md border px-3 py-[6px] text-[12px] transition-colors ${
                      on
                        ? "border-acc text-acc"
                        : "border-line-input text-muted"
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>sumber dokumentasi</span>
            <div className="flex gap-2">
              {(
                [
                  ["manual", "tulis manual"],
                  ["github", "dari README GitHub"],
                  ["none", "nonaktif"],
                ] as [DocSource, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDocSource(value)}
                  className={`rounded-md border px-3 py-[6px] text-[12px] transition-colors ${
                    docSource === value
                      ? "border-acc text-acc"
                      : "border-line-input text-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {docSource === "none" && (
            <div className="rounded-lg border border-line-input bg-bg px-[14px] py-3 text-[12px] leading-[1.7] text-hint">
              Dokumentasi dinonaktifkan: halaman detail tidak menampilkan bagian
              dokumentasi. Isi manual (bila ada) tetap tersimpan.
            </div>
          )}

          {docSource === "github" && (
            <div className="rounded-lg border border-line-input bg-bg px-[14px] py-3 text-[12px] leading-[1.7] text-muted">
              Dokumentasi diambil otomatis dari README repo (
              <span className="text-ink">link repo</span> di atas) dan selalu
              menampilkan versi terbaru. Pastikan link repo terisi. Repo private
              butuh <span className="text-ink">GITHUB_TOKEN</span> di server.
              Salinan terakhir disimpan sebagai cadangan saat kamu simpan.
            </div>
          )}

          {docSource === "manual" && (
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <label className={labelClass} htmlFor="p-doc">
                  dokumentasi (markdown)
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview((v) => !v)}
                  className="text-[11px] text-muted transition-colors hover:text-ink"
                >
                  {showPreview ? "← tulis" : "pratinjau →"}
                </button>
              </div>
              {showPreview ? (
                <div className="min-h-[160px] rounded-lg border border-line-input bg-bg px-[14px] py-[11px]">
                  {documentation.trim() ? (
                    <Markdown>{documentation}</Markdown>
                  ) : (
                    <span className="text-[12px] text-hint">
                      Belum ada isi.
                    </span>
                  )}
                </div>
              ) : (
                <textarea
                  id="p-doc"
                  rows={10}
                  value={documentation}
                  onChange={(e) => setDocumentation(e.target.value)}
                  placeholder={
                    "## Tentang\nCeritakan project ini…\n\n## Cara pakai\n1. …"
                  }
                  className={
                    `${inputClass} resize-y font-mono text-[13px] leading-[1.6]` /* taste-skill-ignore: editing raw markdown */
                  }
                />
              )}
              <span className="text-[11px] text-hint">
                Mendukung Markdown: # judul, **tebal**, - list, `kode`,
                [link](url).
              </span>
            </div>
          )}

          <div className="flex flex-col gap-[6px]">
            <span className={labelClass}>screenshot</span>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex h-[110px] items-center justify-center overflow-hidden rounded-[10px] border-[1.5px] border-dashed border-line-strong bg-chip text-[12px] text-hint transition-colors hover:border-acc"
            >
              {preview ? (
                // biome-ignore lint/performance/noImgElement: local blob/preview thumbnail in admin form
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                "klik untuk pilih gambar"
              )}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-hint">
                hasil crop selalu 1920×1080 (16:9)
              </span>
              {preview && originalFile && (
                <button
                  type="button"
                  onClick={reopenCrop}
                  className="text-[11px] text-acc transition-opacity hover:opacity-80"
                >
                  crop ulang
                </button>
              )}
            </div>
          </div>

          {error && <div className="text-[12px] text-danger">{error}</div>}

          <div className="mt-2 flex justify-end gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line-input px-[18px] py-[11px] text-[13px] text-muted transition-colors hover:text-ink"
            >
              batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-acc px-[18px] py-[11px] text-[13px] font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {saving ? "menyimpan…" : "simpan"}
            </button>
          </div>
        </div>
      </div>

      {cropSrc && (
        <ImageCropper
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}
