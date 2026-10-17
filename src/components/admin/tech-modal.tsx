"use client";

import { useEffect, useState } from "react";
import { FiCpu, FiLoader, FiX } from "react-icons/fi";
import { createTech, type TechInput, updateTech } from "@/app/admin/actions";
import { TechIcon } from "@/components/tech-icon";
import { TECH_CATEGORIES } from "@/lib/tech";
import type { TechCategory, TechItem } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-line-input bg-bg px-3.5 py-2.5 text-sm text-ink placeholder:text-hint outline-none transition-all focus:border-acc focus:ring-1 focus:ring-acc";
const labelClass = "text-xs font-semibold text-muted uppercase tracking-wider";

const COLOR_PRESETS = [
  { label: "Default", color: "" },
  { label: "Next.js", color: "e6edf3" },
  { label: "React / Sky", color: "61dafb" },
  { label: "TypeScript", color: "3178c6" },
  { label: "Tailwind", color: "06b6d4" },
  { label: "Laravel", color: "ff2d20" },
  { label: "Supabase", color: "3ecf8e" },
  { label: "Kotlin", color: "7f52ff" },
  { label: "Python", color: "3776ab" },
];

export function TechModal({
  tech,
  defaultCategory,
  onClose,
  onSaved,
}: {
  tech: TechItem | null;
  defaultCategory?: TechCategory;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!tech;
  const [name, setName] = useState(tech?.name ?? "");
  const [category, setCategory] = useState<TechCategory>(
    tech?.category ?? defaultCategory ?? "frontend",
  );
  const [iconSlug, setIconSlug] = useState(tech?.icon_slug ?? "");
  const [color, setColor] = useState(tech?.color ?? "");
  const [sortOrder, setSortOrder] = useState(String(tech?.sort_order ?? 0));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave() {
    if (!name.trim()) {
      setError("Nama teknologi wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload: TechInput = {
      name: name.trim(),
      category,
      icon_slug: iconSlug.trim(),
      color: color.trim().replace(/^#/, ""),
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    };

    const result = tech
      ? await updateTech(tech.id, payload)
      : await createTech(payload);

    if (!result.ok) {
      setError(result.error ?? "Gagal menyimpan item tech.");
      setSaving(false);
      return;
    }

    onSaved();
  }

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
      <div className="relative w-full max-w-lg rounded-2xl border border-line-input bg-panel shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4 bg-bg/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-acc/10 text-acc">
              <FiCpu className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">
                {isEdit ? "Edit Teknologi" : "Tambah Teknologi"}
              </h2>
              <p className="text-[11px] text-muted">
                {isEdit
                  ? `Mengubah data "${tech.name}"`
                  : "Daftarkan skill baru ke portofolio"}
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger">
              {error}
            </div>
          )}

          {/* Nama */}
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="tech-modal-name">
              Nama Teknologi <span className="text-danger">*</span>
            </label>
            <input
              id="tech-modal-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: TypeScript, PostgreSQL, Docker..."
              className={inputClass}
            />
          </div>

          {/* Kategori & Urutan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="tech-modal-cat">
                Kategori
              </label>
              <select
                id="tech-modal-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value as TechCategory)}
                className={inputClass}
              >
                {TECH_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="tech-modal-order">
                Urutan Tampil (Sort Order)
              </label>
              <input
                id="tech-modal-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="10, 20, 30..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Slug & Warna */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="tech-modal-slug">
                Slug Ikon (Opsional)
              </label>
              <input
                id="tech-modal-slug"
                value={iconSlug}
                onChange={(e) => setIconSlug(e.target.value)}
                placeholder="Otomatis dari nama"
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className={labelClass} htmlFor="tech-modal-color">
                Warna Hex (Opsional)
              </label>
              <div className="relative">
                <input
                  id="tech-modal-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="mis. 3178C6"
                  className={inputClass}
                />
                {color && (
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border border-white/30"
                    style={{ backgroundColor: `#${color.replace(/^#/, "")}` }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-hint">Preset Warna:</span>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setColor(p.color)}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] transition-colors ${
                    color === p.color
                      ? "border-acc bg-acc/10 text-acc"
                      : "border-line bg-bg text-muted hover:text-ink"
                  }`}
                >
                  {p.color && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: `#${p.color}` }}
                    />
                  )}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl border border-line bg-bg p-3.5 flex items-center justify-between">
            <span className="text-xs text-muted">Pratinjau Tampilan:</span>
            {name.trim() ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-line-chip bg-chip px-3 py-1.5 text-xs font-mono font-medium text-ink">
                <TechIcon
                  key={`${name}|${iconSlug}|${color}`}
                  name={name}
                  iconSlug={iconSlug}
                  color={color}
                  size={16}
                  className="flex-none"
                />
                <span>{name}</span>
              </div>
            ) : (
              <span className="text-xs text-hint italic">
                Ketik nama untuk melihat ikon
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-line px-6 py-4 bg-bg/40">
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
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
