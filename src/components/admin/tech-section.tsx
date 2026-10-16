"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteTech,
  deleteTechMany,
  updateTechCategoryMany,
} from "@/app/admin/actions";
import { TechIcon } from "@/components/tech-icon";
import { TECH_CATEGORIES } from "@/lib/tech";
import type { TechCategory, TechItem } from "@/lib/types";
import { TechModal } from "./tech-modal";

const checkClass = "h-[15px] w-[15px] flex-none cursor-pointer accent-acc";

const ghostBtn =
  "rounded-lg border border-line-input px-[11px] py-[6px] text-[11.5px] text-muted transition-colors hover:border-line-hover hover:text-ink disabled:opacity-50";

const dangerBtn =
  "rounded-lg border border-danger/35 px-[11px] py-[6px] text-[11.5px] text-danger transition-colors hover:bg-danger/12 disabled:opacity-50";

export function TechSection({ tech }: { tech: TechItem[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TechItem | null>(null);
  const [defaultCategory, setDefaultCategory] =
    useState<TechCategory>("frontend");
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [bulkCategory, setBulkCategory] = useState<TechCategory>("frontend");
  const [pending, startTransition] = useTransition();

  const groups = TECH_CATEGORIES.map((c) => ({
    ...c,
    items: tech.filter((t) => t.category === c.key),
  }));

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
    if (!confirm(`Hapus ${ids.length} tech yang dipilih?`)) return;
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-[-0.01em]">
            Tech Stack
          </h1>
          <p className="mt-[6px] text-[12.5px] text-muted">
            {`${tech.length} item · dikelompokkan per kategori · tampil di section “skills” homepage`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAdd("frontend")}
          className="rounded-lg bg-acc px-[18px] py-[11px] text-[13px] font-semibold text-bg transition-opacity hover:opacity-85"
        >
          + Tambah Tech
        </button>
      </div>

      {selectedCount > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-[10px] rounded-lg border border-acc/35 bg-acc/8 px-[14px] py-[10px]">
          <span className="text-[12px] text-ink">
            {`${selectedCount} dipilih`}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value as TechCategory)}
              className="rounded-lg border border-line-input bg-bg px-[10px] py-[6px] text-[11.5px] text-ink outline-none focus:border-acc"
            >
              {TECH_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleBulkMove}
              disabled={pending}
              className={ghostBtn}
            >
              pindah kategori
            </button>
          </div>
          <button
            type="button"
            onClick={handleBulkDelete}
            disabled={pending}
            className={dangerBtn}
          >
            hapus terpilih
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="ml-auto text-[11.5px] text-muted transition-colors hover:text-ink"
          >
            batal pilih
          </button>
        </div>
      )}

      <div className="mt-7 grid items-start gap-4 lg:grid-cols-2">
        {groups.map((g) => {
          const allInCat =
            g.items.length > 0 && g.items.every((t) => selected.has(t.id));
          return (
            <section
              key={g.key}
              className="rounded-xl border border-line bg-panel px-[18px] py-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-[12.5px] text-muted">
                  {"// "}
                  {g.label}
                  <span className="text-hint">{` · ${g.items.length}`}</span>
                </div>
                <div className="flex items-center gap-3">
                  {g.items.length > 0 && (
                    <label className="flex cursor-pointer items-center gap-[7px] text-[11.5px] text-muted select-none">
                      <input
                        type="checkbox"
                        checked={allInCat}
                        onChange={() => toggleCategory(g.items)}
                        className={checkClass}
                      />
                      pilih semua
                    </label>
                  )}
                  <button
                    type="button"
                    onClick={() => openAdd(g.key)}
                    className={ghostBtn}
                  >
                    + tambah
                  </button>
                </div>
              </div>

              {g.items.length === 0 ? (
                <p className="mt-3 text-[11.5px] text-hint">
                  belum ada item — klik “+ tambah”
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {g.items.map((t) => (
                    <div
                      key={t.id}
                      className={`flex items-center gap-3 rounded-lg border px-[12px] py-[9px] transition-colors ${
                        selected.has(t.id)
                          ? "border-acc/45 bg-acc/8"
                          : "border-line bg-bg"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(t.id)}
                        onChange={() => toggle(t.id)}
                        aria-label={`Pilih ${t.name}`}
                        className={checkClass}
                      />
                      <TechIcon
                        name={t.name}
                        iconSlug={t.icon_slug}
                        color={t.color}
                        size={16}
                        className="flex-none"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-medium">
                          {t.name}
                        </div>
                      </div>
                      <span className="text-[10.5px] text-hint">
                        {`#${t.sort_order}`}
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className={ghostBtn}
                        >
                          edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t)}
                          disabled={pending}
                          className={dangerBtn}
                        >
                          hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

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
