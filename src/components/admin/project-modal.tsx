"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiCrop,
  FiExternalLink,
  FiFileText,
  FiGithub,
  FiGlobe,
  FiImage,
  FiInfo,
  FiLayers,
  FiLoader,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
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
  "w-full rounded-xl border border-line-input bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-hint outline-none transition-all focus:border-acc focus:ring-1 focus:ring-acc";
const labelClass = "text-xs font-semibold text-muted tracking-wide uppercase";

type ModalTab = "info" | "tech" | "docs" | "image";

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
  const [activeTab, setActiveTab] = useState<ModalTab>("info");

  // Form states
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
  const [docPreview, setDocPreview] = useState(false);
  const [techSearch, setTechSearch] = useState("");

  // Image states
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    project?.image_url ?? null,
  );
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Status states
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Close on Escape
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

  function handleCropConfirm(croppedFile: File) {
    setFile(croppedFile);
    setPreview(URL.createObjectURL(croppedFile));
    setCropSrc(null);
  }

  function reopenCrop() {
    if (originalFile) setCropSrc(URL.createObjectURL(originalFile));
  }

  async function handleImportGitHub() {
    if (!repoUrl.trim()) {
      setError("Masukkan link repositori GitHub terlebih dahulu.");
      setActiveTab("info");
      return;
    }
    setImporting(true);
    setError(null);
    setImportNotice(null);

    const result = await importFromGitHub(repoUrl);
    setImporting(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Gagal mengimpor dari GitHub.");
      return;
    }

    const { title: t, description: d, tech: imported } = result.data;
    if (t) setTitle(t);
    if (d) setDescription(d);
    if (imported && imported.length > 0) {
      setTech((prev) => [...new Set([...prev, ...imported])]);
    }
    if (!isEdit) setDocSource("github");
    setImportNotice(
      `Berhasil mengimpor metadata GitHub (${imported.length} tech terdeteksi).`,
    );
  }

  async function handleSave() {
    if (!title.trim()) {
      setError("Judul project wajib diisi.");
      setActiveTab("info");
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
        setError(result.error ?? "Gagal menyimpan project.");
        setSaving(false);
        return;
      }

      onSaved();
    } catch (e) {
      setError((e as Error).message);
      setSaving(false);
    }
  }

  const allAvailableTech = [...new Set([...techOptions, ...tech])];
  const filteredTech = allAvailableTech.filter((t) =>
    t.toLowerCase().includes(techSearch.trim().toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Tutup dialog"
        className="fixed inset-0 cursor-default bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-line-input bg-panel shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-bg/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-acc/10 text-acc">
              <FiLayers className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                {isEdit ? "Edit Project" : "Tambah Project Baru"}
              </h2>
              <p className="text-[11px] text-muted">
                {isEdit
                  ? `Mengubah data "${project.title}"`
                  : "Isi detail dan unggah screenshot"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-chip hover:text-ink transition-colors"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-line bg-panel/70 px-6 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: "info", label: "Informasi", icon: FiInfo },
            {
              id: "tech",
              label: `Tech Stack (${tech.length})`,
              icon: FiLayers,
            },
            { id: "docs", label: "Dokumentasi", icon: FiFileText },
            { id: "image", label: "Screenshot", icon: FiImage },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as ModalTab)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
                  active
                    ? "border-acc text-acc"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger">
              <span className="font-bold">Error:</span>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {importNotice && (
            <div className="flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 p-3.5 text-xs text-success">
              <FiCheck className="h-4 w-4 flex-none mt-0.5" />
              <span className="flex-1">{importNotice}</span>
            </div>
          )}

          {/* TAB 1: INFORMASI UTAMA */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className={labelClass} htmlFor="modal-title">
                  Judul Project <span className="text-danger">*</span>
                </label>
                <input
                  id="modal-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Portfolio Website, E-Commerce App..."
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={labelClass} htmlFor="modal-desc">
                    Deskripsi Singkat
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowDescription((v) => !v)}
                    className={`text-xs font-semibold transition-colors ${
                      showDescription
                        ? "text-acc hover:opacity-80"
                        : "text-hint hover:text-muted"
                    }`}
                  >
                    {showDescription
                      ? "● Tampil di website"
                      : "○ Disembunyikan"}
                  </button>
                </div>
                {showDescription ? (
                  <textarea
                    id="modal-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan secara ringkas 1-2 kalimat mengenai project ini..."
                    className={`${inputClass} resize-y leading-relaxed`}
                  />
                ) : (
                  <div className="rounded-xl border border-line-input bg-bg/50 p-3 text-xs text-hint">
                    Deskripsi dinonaktifkan: tidak akan ditampilkan di kartu
                    homepage maupun halaman detail, namun isi teks tetap
                    tersimpan.
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor="modal-demo">
                    Link Live Demo
                  </label>
                  <div className="relative">
                    <FiGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
                    <input
                      id="modal-demo"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://my-app.vercel.app"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass} htmlFor="modal-repo">
                    Link GitHub Repository
                  </label>
                  <div className="relative">
                    <FiGithub className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
                    <input
                      id="modal-repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/username/repo"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>

              {/* GitHub Auto Import */}
              <div className="rounded-xl border border-line-chip bg-chip/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-ink flex items-center gap-1.5">
                    <FiGithub className="h-3.5 w-3.5 text-acc" />
                    <span>Sinkronisasi Otomatis dari GitHub</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted">
                    Ambil nama, deskripsi, dan teknologi otomatis dari
                    `package.json` repo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleImportGitHub}
                  disabled={importing || saving || !repoUrl.trim()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line-input bg-panel px-3.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-acc hover:text-ink disabled:opacity-40"
                >
                  {importing ? (
                    <>
                      <FiLoader className="h-3.5 w-3.5 animate-spin text-acc" />
                      <span>Mengimpor…</span>
                    </>
                  ) : (
                    <>
                      <span>Impor dari Repo</span>
                      <FiExternalLink className="h-3 w-3" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: TECH STACK */}
          {activeTab === "tech" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">
                    Pilih Teknologi ({tech.length} Terpilih)
                  </h3>
                  <p className="text-[11px] text-hint">
                    Klik badge untuk menambah atau menghapus teknologi dari
                    project ini.
                  </p>
                </div>
                {tech.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setTech([])}
                    className="text-xs text-danger hover:underline"
                  >
                    Hapus Semua
                  </button>
                )}
              </div>

              {/* Search Tech */}
              <input
                type="text"
                value={techSearch}
                onChange={(e) => setTechSearch(e.target.value)}
                placeholder="Cari teknologi..."
                className={inputClass}
              />

              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1 border border-line rounded-xl bg-bg/40">
                {filteredTech.length === 0 ? (
                  <div className="w-full py-8 text-center text-xs text-hint">
                    Tidak ada teknologi yang cocok. Tambah dulu di halaman Tech
                    Stack.
                  </div>
                ) : (
                  filteredTech.map((name) => {
                    const isSelected = tech.includes(name);
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleTech(name)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          isSelected
                            ? "border-acc bg-acc/15 text-acc shadow-sm shadow-acc/10"
                            : "border-line-input bg-panel text-muted hover:border-line-hover hover:text-ink"
                        }`}
                      >
                        {isSelected && (
                          <FiCheck className="h-3 w-3 stroke-[3]" />
                        )}
                        <span>{name}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DOKUMENTASI */}
          {activeTab === "docs" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className={labelClass}>Sumber Dokumentasi</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: "github",
                      label: "README GitHub",
                      desc: "Sinkronisasi langsung",
                      icon: FiGithub,
                    },
                    {
                      id: "manual",
                      label: "Tulis Manual",
                      desc: "Markdown tersimpan",
                      icon: FiFileText,
                    },
                    {
                      id: "none",
                      label: "Nonaktif",
                      desc: "Tanpa dokumentasi",
                      icon: FiX,
                    },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setDocSource(s.id as DocSource)}
                      className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                        docSource === s.id
                          ? "border-acc bg-acc/10 text-ink shadow-sm"
                          : "border-line-input bg-panel text-muted hover:border-line-hover hover:text-ink"
                      }`}
                    >
                      <span
                        className={`text-xs font-bold ${docSource === s.id ? "text-acc" : ""}`}
                      >
                        {s.label}
                      </span>
                      <span className="text-[10px] text-hint mt-0.5">
                        {s.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {docSource === "github" && (
                <div className="rounded-xl border border-line bg-bg/50 p-4 text-xs text-muted leading-relaxed space-y-2">
                  <p>
                    Dokumentasi akan diambil secara langsung dari file{" "}
                    <span className="font-mono text-ink">README.md</span> pada
                    link repositori GitHub di tab Informasi.
                  </p>
                  <p className="text-[11px] text-hint">
                    Pastikan repositori bersifat publik, atau pastikan variabel{" "}
                    <span className="font-mono text-ink">GITHUB_TOKEN</span>{" "}
                    sudah terkonfigurasi untuk repositori privat.
                  </p>
                </div>
              )}

              {docSource === "none" && (
                <div className="rounded-xl border border-line bg-bg/50 p-4 text-xs text-hint leading-relaxed">
                  Bagian dokumentasi tidak akan ditampilkan di halaman detail
                  project (/projects/{project?.slug ?? "slug"}).
                </div>
              )}

              {docSource === "manual" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass} htmlFor="modal-doc-editor">
                      Konten Markdown
                    </label>
                    <button
                      type="button"
                      onClick={() => setDocPreview((v) => !v)}
                      className="text-xs font-semibold text-acc hover:underline"
                    >
                      {docPreview ? "← Mode Editor" : "Pratinjau Hasil →"}
                    </button>
                  </div>

                  {docPreview ? (
                    <div className="min-h-[220px] max-h-[340px] overflow-y-auto rounded-xl border border-line-input bg-bg p-4 text-sm">
                      {documentation.trim() ? (
                        <Markdown>{documentation}</Markdown>
                      ) : (
                        <p className="text-xs text-hint italic">
                          Belum ada konten ditulis.
                        </p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      id="modal-doc-editor"
                      rows={9}
                      value={documentation}
                      onChange={(e) => setDocumentation(e.target.value)}
                      placeholder="## Ringkasan Project&#10;Jelaskan arsitektur, tantangan teknis, dan solusi...&#10;&#10;## Fitur Utama&#10;- Fitur A&#10;- Fitur B"
                      className={`${inputClass} font-mono text-xs leading-relaxed resize-y`}
                    />
                  )}
                  <p className="text-[11px] text-hint">
                    Mendukung format Markdown: # Heading, **tebal**, - list,
                    `kode`, [link](url).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SCREENSHOT */}
          {activeTab === "image" && (
            <div className="space-y-4">
              <span className={labelClass}>Screenshot Project (16:9 HD)</span>

              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line-strong bg-chip/30 transition-all hover:border-acc hover:bg-chip/50"
              >
                {preview ? (
                  // biome-ignore lint/performance/noImgElement: admin preview
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-6 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-acc/10 text-acc transition-transform group-hover:scale-110">
                      <FiUploadCloud className="h-6 w-6" />
                    </div>
                    <div className="text-xs font-semibold text-ink">
                      Klik untuk memilih gambar screenshot
                    </div>
                    <div className="text-[11px] text-hint">
                      Format PNG, JPG, atau WebP. Gambar akan otomatis di-crop
                      ke format 16:9.
                    </div>
                  </div>
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
                  Resolusi rekomendasi: 1920×1080 piksel
                </span>
                {preview && originalFile && (
                  <button
                    type="button"
                    onClick={reopenCrop}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-acc hover:underline"
                  >
                    <FiCrop className="h-3.5 w-3.5" />
                    <span>Sesuaikan Posisi Crop</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-line px-6 py-4 bg-bg/40">
          <div className="text-xs text-hint">
            {activeTab === "info" && "Tab 1 dari 4"}
            {activeTab === "tech" && "Tab 2 dari 4"}
            {activeTab === "docs" && "Tab 3 dari 4"}
            {activeTab === "image" && "Tab 4 dari 4"}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-line-input bg-panel px-4 py-2 text-xs font-semibold text-muted hover:border-line-hover hover:text-ink transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-acc px-5 py-2 text-xs font-semibold text-bg hover:opacity-90 transition-all disabled:opacity-60 shadow-lg shadow-acc/10"
            >
              {saving ? (
                <>
                  <FiLoader className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan…</span>
                </>
              ) : (
                <span>Simpan Project</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
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
