"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTech } from "@/app/admin/actions";
import { TechIcon } from "@/components/tech-icon";
import { TECH_CATEGORIES } from "@/lib/tech";
import type { TechItem } from "@/lib/types";
import { TechModal } from "./tech-modal";

const catLabel = Object.fromEntries(
  TECH_CATEGORIES.map((c) => [c.key, c.label]),
);

export function TechSection({ tech }: { tech: TechItem[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TechItem | null>(null);
  const [pending, startTransition] = useTransition();

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(t: TechItem) {
    setEditing(t);
    setModalOpen(true);
  }

  function handleDelete(t: TechItem) {
    if (!confirm(`Hapus "${t.name}" dari tech-stack?`)) return;
    startTransition(async () => {
      await deleteTech(t.id);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 rounded-xl border border-line bg-panel px-[18px] py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[13px] text-ink">tech-stack</div>
          <div className="mt-1 font-mono text-[11.5px] text-muted">
            {tech.length} item · tampil di section “skills” &amp; pilihan tech
            project
          </div>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-md border border-line-input px-[13px] py-[7px] font-mono text-[12px] text-muted transition-colors hover:border-line-hover hover:text-ink"
        >
          + tambah tech
        </button>
      </div>

      {tech.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {tech.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 rounded-lg border border-line bg-bg px-[14px] py-[10px]"
            >
              <TechIcon
                name={t.name}
                iconSlug={t.icon_slug}
                color={t.color}
                size={17}
                className="flex-none"
              />
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium">{t.name}</div>
                <div className="mt-[2px] font-mono text-[11px] text-hint">
                  {catLabel[t.category] ?? t.category} · #{t.sort_order}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(t)}
                  className="rounded-md border border-line-input px-[11px] py-[6px] font-mono text-[11.5px] text-muted transition-colors hover:border-line-hover hover:text-ink"
                >
                  edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t)}
                  disabled={pending}
                  className="rounded-md border border-danger/35 px-[11px] py-[6px] font-mono text-[11.5px] text-danger transition-colors hover:bg-danger/12"
                >
                  hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <TechModal
          tech={editing}
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
