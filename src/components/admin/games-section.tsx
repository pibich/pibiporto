"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteGame } from "@/app/admin/actions";
import type { Game } from "@/lib/types";
import { GameModal } from "./game-modal";

export function GamesSection({ games }: { games: Game[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);
  const [pending, startTransition] = useTransition();

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(g: Game) {
    setEditing(g);
    setModalOpen(true);
  }

  function handleDelete(g: Game) {
    if (!confirm(`Hapus game "${g.name}"?`)) return;
    startTransition(async () => {
      await deleteGame(g.id);
      router.refresh();
    });
  }

  return (
    <div className="mt-6 rounded-xl border border-line bg-panel px-[18px] py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-[13px] text-ink">joki / games</div>
          <div className="mt-1 font-mono text-[11.5px] text-muted">
            {games.length} game · tampil di halaman /boosting
          </div>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="rounded-lg border border-acc px-[14px] py-[8px] font-mono text-[12px] font-semibold text-acc transition-opacity hover:opacity-85"
        >
          + Tambah Game
        </button>
      </div>

      {games.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {games.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-3 rounded-lg border border-line px-3 py-[10px] transition-colors hover:border-line-hover"
            >
              <div className="flex h-10 w-[60px] flex-none items-center justify-center overflow-hidden rounded-[6px] border border-dashed border-line-strong font-mono text-[9px] text-hint">
                {g.image_url ? (
                  // biome-ignore lint/performance/noImgElement: tiny admin thumbnail
                  <img
                    src={g.image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "img"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold">{g.name}</div>
                <div className="mt-[2px] truncate font-mono text-[11px] text-muted">
                  {g.tags.join(" · ") || "—"}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(g)}
                  className="rounded-md border border-line-input px-[12px] py-[6px] font-mono text-[11.5px] text-muted transition-colors hover:border-line-hover hover:text-ink"
                >
                  edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(g)}
                  disabled={pending}
                  className="rounded-md border border-danger/35 px-[12px] py-[6px] font-mono text-[11.5px] text-danger transition-colors hover:bg-danger/12"
                >
                  hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <GameModal
          game={editing}
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
