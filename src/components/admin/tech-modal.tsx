"use client";

import { useEffect, useState } from "react";
import { createTech, type TechInput, updateTech } from "@/app/admin/actions";
import { TechIcon } from "@/components/tech-icon";
import { TECH_CATEGORIES } from "@/lib/tech";
import type { TechCategory, TechItem } from "@/lib/types";

const inputClass =
  "rounded-lg border border-line-input bg-bg px-[14px] py-[11px] font-sans text-[14.5px] text-ink outline-none focus:border-acc";
const labelClass = "font-mono text-[11.5px] text-muted";

export function TechModal({
  tech,
  onClose,
  onSaved,
}: {
  tech: TechItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!tech;
  const [name, setName] = useState(tech?.name ?? "");
  const [category, setCategory] = useState<TechCategory>(
    tech?.category ?? "foundation",
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
      setError("Nama wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload: TechInput = {
      name,
      category,
      icon_slug: iconSlug,
      color,
      sort_order: Number.parseInt(sortOrder, 10) || 0,
    };
    const result = tech
      ? await updateTech(tech.id, payload)
      : await createTech(payload);
    if (!result.ok) {
      setError(result.error ?? "Gagal menyimpan.");
      setSaving(false);
      return;
    }
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(5,7,10,0.7)] backdrop-blur-[4px]"
      />
      <div className="relative max-h-[90vh] w-[460px] max-w-full overflow-auto rounded-2xl border border-line-input bg-panel p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-bold">
            {isEdit ? "Edit Tech" : "Tambah Tech"}
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
            <label className={labelClass} htmlFor="t-name">
              nama
            </label>
            <input
              id="t-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="mis. TypeScript"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-[6px]">
              <label className={labelClass} htmlFor="t-cat">
                kategori
              </label>
              <select
                id="t-cat"
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
            <div className="flex flex-col gap-[6px]">
              <label className={labelClass} htmlFor="t-order">
                urutan
              </label>
              <input
                id="t-order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-[6px]">
              <label className={labelClass} htmlFor="t-slug">
                slug ikon (opsional)
              </label>
              <input
                id="t-slug"
                value={iconSlug}
                onChange={(e) => setIconSlug(e.target.value)}
                placeholder="otomatis dari nama"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-[6px]">
              <label className={labelClass} htmlFor="t-color">
                warna (opsional)
              </label>
              <input
                id="t-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="mis. 3178C6"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-line-input bg-bg px-[14px] py-3">
            <span className={labelClass}>pratinjau ikon:</span>
            {name.trim() ? (
              <span className="inline-flex items-center gap-[7px] font-mono text-[13px] text-ink">
                <TechIcon
                  key={`${name}|${iconSlug}|${color}`}
                  name={name}
                  iconSlug={iconSlug}
                  color={color}
                  size={16}
                  className="flex-none"
                />
                {name}
              </span>
            ) : (
              <span className="font-mono text-[12px] text-hint">
                isi nama dulu
              </span>
            )}
          </div>
          <p className="font-mono text-[11px] text-hint leading-[1.6]">
            Ikon diambil otomatis dari Simple Icons berdasarkan nama. Jika tidak
            muncul, isi slug manual (lihat simpleicons.org) atau biarkan kosong.
          </p>

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
