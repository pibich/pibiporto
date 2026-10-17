"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import {
  deleteTech,
  deleteTechMany,
  updateTechCategoryMany,
} from "@/app/admin/actions";
import { TechIcon } from "@/components/tech-icon";
import { TECH_CATEGORIES } from "@/lib/tech";
import type { TechCategory, TechItem } from "@/lib/types";
import { TechModal } from "./tech-modal";

const checkClass =
  "h-4 w-4 rounded border-line-strong text-acc focus:ring-acc cursor-pointer";

export function TechSection({ tech }: { tech: TechItem[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TechItem | null>(null);
  const [defaultCategory, setDefaultCategory] =
    useState<TechCategory>("frontend");
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState<TechCategory>("frontend");
  const [search, setSearch] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");
  const [pending, startTransition] = useTransition();

  // Filtered tech based on search and tab
  const filteredTech = useMemo(() => {
    return tech.filter((t) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || t.name.toLowerCase().includes(q);
      const matchTab =
        selectedCategoryTab === "all" || t.category === selectedCategoryTab;
      return matchSearch && matchTab;
    });
  }, [tech, search, selectedCategoryTab]);

  // Grouped by categories
  const groups = useMemo(() => {
    return TECH_CATEGORIES.map((c) => ({
      ...c,
      items: filteredTech.filter((t) => t.category === c.key),
    })).filter(
      (c) => selectedCategoryTab === "all" || c.key === selectedCategoryTab,
    );
  }, [filteredTech, selectedCategoryTab]);

  const selectedCount = tech.filter((t) => selected.has(t.id)).length;

  function openAdd(cat: TechCategory) {
    setDefaultCategory(cat);
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(t: TechItem) {
    setEditing(t);
    setModalOpen(true);
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleCategory(items: TechItem[]) {
    setSelected((prev) => {
      const next = new Set(prev);
      const allIn = items.every((t) => next.has(t.id));
      for (const t of items) {
        if (allIn) next.delete(t.id);
        else next.add(t.id);
      }
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function selectedIds() {
    return tech.filter((t) => selected.has(t.id)).map((t) => t.id);
  }

  function handleDelete(t: TechItem) {
    if (!confirm(`Hapus "${t.name}" dari tech-stack?`)) return;
    startTransition(async () => {
      await deleteTech(t.id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(t.id);
        return next;
      });
      router.refresh();
    });
  }

  function handleBulkDelete() {
    const ids = selectedIds();
    if (ids.length === 0) return;
    if (!confirm(`Hapus ${ids.length} teknologi yang dipilih?`)) return;
    startTransition(async () => {
      await deleteTechMany(ids);
      clearSelection();
      router.refresh();
    });
  }

  function handleBulkMove() {
    const ids = selectedIds();
    if (ids.length === 0) return;
    startTransition(async () => {
      await updateTechCategoryMany(ids, bulkCategory);
      clearSelection();
      router.refresh();
    });
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-ink">
              Tech Stack & Keahlian
            </h1>
            <span className="rounded-full bg-acc/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-acc border border-acc/20">
              {tech.length}
            </span>
          </div>
          <p className="mt-1 text-[13px] text-muted">
            Daftar teknologi yang Anda kuasai, dikelompokkan sesuai kategori
            pada section skills homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openAdd("frontend")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-acc px-4 py-2.5 text-sm font-semibold text-bg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-acc/20 active:scale-[0.98]"
        >
          <FiPlus className="h-4 w-4 stroke-[2.5]" />
          <span>Tambah Teknologi</span>
        </button>
      </div>

      {/* Search & Category Tabs */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama skill / teknologi..."
            className="w-full rounded-xl border border-line-input bg-panel pl-10 pr-4 py-2 text-[13px] text-ink placeholder:text-hint outline-none transition-all focus:border-acc focus:ring-1 focus:ring-acc"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-hint hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategoryTab("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex-none ${
              selectedCategoryTab === "all"
                ? "bg-acc text-bg font-semibold"
                : "border border-line-input bg-panel text-muted hover:border-line-hover hover:text-ink"
            }`}
          >
            Semua ({tech.length})
          </button>
          {TECH_CATEGORIES.map((c) => {
            const count = tech.filter((t) => t.category === c.key).length;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCategoryTab(c.key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors flex-none ${
                  selectedCategoryTab === c.key
                    ? "bg-acc text-bg font-semibold"
                    : "border border-line-input bg-panel text-muted hover:border-line-hover hover:text-ink"
                }`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedCount > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-acc/40 bg-acc/10 px-4 py-2.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-acc text-[11px] font-bold text-bg">
              {selectedCount}
            </span>
            <span className="text-xs font-semibold text-ink">item dipilih</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5">
              <select
                value={bulkCategory}
                onChange={(e) =>
                  setBulkCategory(e.target.value as TechCategory)
                }
                className="rounded-lg border border-line-input bg-panel px-2.5 py-1 text-xs text-ink outline-none"
              >
                {TECH_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    Pindah ke: {c.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleBulkMove}
                disabled={pending}
                className="rounded-lg border border-line-input bg-panel px-3 py-1 text-xs font-medium text-muted hover:border-acc hover:text-ink disabled:opacity-50"
              >
                Pindahkan
              </button>
            </div>

            <button
              type="button"
              onClick={handleBulkDelete}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded-lg border border-danger/40 bg-danger/10 px-3 py-1 text-xs font-medium text-danger hover:bg-danger/20 disabled:opacity-50"
            >
              <FiTrash2 className="h-3 w-3" />
              <span>Hapus Terpilih</span>
            </button>

            <button
              type="button"
              onClick={clearSelection}
              className="ml-2 text-xs text-muted hover:text-ink"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {groups.map((g) => {
          const allInCat =
            g.items.length > 0 && g.items.every((t) => selected.has(t.id));
          return (
            <div
              key={g.key}
              className="flex flex-col rounded-2xl border border-line bg-panel p-5 transition-all hover:border-line-hover"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-chip font-mono text-xs font-bold text-acc">
                    {"//"}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink uppercase tracking-wide">
                      {g.label}
                    </h3>
                    <span className="text-[11px] text-hint">
                      {g.items.length} teknologi terdaftar
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {g.items.length > 0 && (
                    <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted hover:text-ink select-none mr-1">
                      <input
                        type="checkbox"
                        checked={allInCat}
                        onChange={() => toggleCategory(g.items)}
                        className={checkClass}
                      />
                      <span>Pilih semua</span>
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={() => openAdd(g.key)}
                    className="inline-flex items-center gap-1 rounded-lg border border-line-input bg-bg px-2.5 py-1 text-xs font-medium text-muted hover:border-acc hover:text-ink transition-colors"
                  >
                    <FiPlus className="h-3 w-3" />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="mt-3.5 flex-1">
                {g.items.length === 0 ? (
                  <div className="py-6 text-center text-xs text-hint italic">
                    Belum ada teknologi pada kategori ini. Klik "+ Tambah".
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {g.items.map((t) => {
                      const isChecked = selected.has(t.id);
                      return (
                        <div
                          key={t.id}
                          className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all ${
                            isChecked
                              ? "border-acc/40 bg-acc/10"
                              : "border-line bg-bg/60 hover:border-line-hover"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(t.id)}
                            aria-label={`Pilih ${t.name}`}
                            className={checkClass}
                          />

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chip flex-none">
                            <TechIcon
                              name={t.name}
                              iconSlug={t.icon_slug}
                              color={t.color}
                              size={18}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-ink">
                              {t.name}
                            </div>
                            <div className="text-[11px] font-mono text-hint">
                              order: #{t.sort_order}
                              {t.icon_slug ? ` · icon: ${t.icon_slug}` : ""}
                            </div>
                          </div>

                          {t.color && (
                            <span
                              className="h-3.5 w-3.5 rounded-full border border-white/20 flex-none"
                              style={{ backgroundColor: `#${t.color}` }}
                              title={`Warna kustom: #${t.color}`}
                            />
                          )}

                          <div className="flex items-center gap-1 flex-none">
                            <button
                              type="button"
                              onClick={() => openEdit(t)}
                              title="Edit item"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-chip hover:text-ink transition-colors"
                            >
                              <FiEdit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(t)}
                              disabled={pending}
                              title="Hapus item"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger transition-colors"
                            >
                              <FiTrash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech Modal Form */}
      {modalOpen && (
        <TechModal
          tech={editing}
          defaultCategory={defaultCategory}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
