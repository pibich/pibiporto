"use client";

import { useEffect, useRef, useState } from "react";
import {
  createProject,
  type ProjectInput,
  updateProject,
} from "@/app/admin/actions";
import { type Project, TECH_OPTIONS } from "@/lib/types";
import { uploadImage } from "@/lib/upload";

const inputClass =
  "rounded-lg border border-line-input bg-bg px-[14px] py-[11px] font-sans text-[14.5px] text-ink outline-none focus:border-acc";
const labelClass = "font-mono text-[11.5px] text-muted";

export function ProjectModal({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!project;
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demo_url ?? "");
  const [repoUrl, setRepoUrl] = useState(project?.repo_url ?? "");
  const [tech, setTech] = useState<string[]>(project?.tech ?? []);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    project?.image_url ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
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
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
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
        className="absolute inset-0 cursor-default bg-[rgba(5,7,10,0.7)] backdrop-blur-[4px]"
      />
      <div className="relative max-h-[90vh] w-[520px] max-w-full overflow-auto rounded-2xl border border-line-input bg-panel p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-bold">
            {isEdit ? "Edit Project" : "Tambah Project"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-sm text-muted transition-colors hover:text-ink"
          >
            ✕
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
            <label className={labelClass} htmlFor="p-desc">
              deskripsi singkat
            </label>
            <textarea
              id="p-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi 1-2 kalimat…"
              className={`${inputClass} resize-y`}
            />
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

          <div className="flex flex-col gap-2">
            <span className={labelClass}>tech stack</span>
            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map((name) => {
                const on = tech.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleTech(name)}
                    className={`rounded-md border px-3 py-[6px] font-mono text-[12px] transition-colors ${
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

          <div className="flex flex-col gap-[6px]">
            <span className={labelClass}>screenshot</span>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex h-[110px] items-center justify-center overflow-hidden rounded-[10px] border-[1.5px] border-dashed border-line-strong bg-chip font-mono text-[12px] text-hint transition-colors hover:border-acc"
            >
              {preview ? (
                // biome-ignore lint/performance/noImgElement: local blob/preview thumbnail in admin form
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                "klik atau drop gambar di sini"
              )}
            </button>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {error && (
            <div className="font-mono text-[12px] text-danger">{error}</div>
          )}

          <div className="mt-2 flex justify-end gap-[10px]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line-input px-[18px] py-[11px] font-mono text-[13px] text-muted transition-colors hover:text-ink"
            >
              batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-acc px-[18px] py-[11px] font-mono text-[13px] font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
            >
              {saving ? "menyimpan…" : "simpan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
