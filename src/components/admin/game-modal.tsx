"use client";

import { useEffect, useRef, useState } from "react";
import { createGame, type GameInput, updateGame } from "@/app/admin/actions";
import type { Game } from "@/lib/types";
import { uploadImage } from "@/lib/upload";

const inputClass =
  "rounded-lg border border-line-input bg-bg px-[14px] py-[11px] font-sans text-[14.5px] text-ink outline-none focus:border-acc";
const labelClass = "font-mono text-[11.5px] text-muted";

export function GameModal({
  game,
  onClose,
  onSaved,
}: {
  game: Game | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!game;
  const [name, setName] = useState(game?.name ?? "");
  const [tags, setTags] = useState((game?.tags ?? []).join(", "));
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    game?.image_url ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function pickFile(f: File | null) {
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!name.trim()) {
      setError("Nama game wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const image_url = file
        ? await uploadImage(file)
        : (game?.image_url ?? null);
      const payload: GameInput = {
        name,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image_url,
      };
      const result = game
        ? await updateGame(game.id, payload)
        : await createGame(payload);
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
      <button
        type="button"
        aria-label="Tutup dialog"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(5,7,10,0.7)] backdrop-blur-[4px]"
      />
      <div className="relative max-h-[90vh] w-[480px] max-w-full overflow-auto rounded-2xl border border-line-input bg-panel p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-bold">
            {isEdit ? "Edit Game" : "Tambah Game"}
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
            <label className={labelClass} htmlFor="g-name">
              nama game
            </label>
            <input
              id="g-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Genshin Impact"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <label className={labelClass} htmlFor="g-tags">
              tags (pisahkan dengan koma)
            </label>
            <input
              id="g-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="spiral abyss, eksplorasi, quest"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-[6px]">
            <span className={labelClass}>gambar / banner</span>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="flex h-[130px] items-center justify-center overflow-hidden rounded-[10px] border-[1.5px] border-dashed border-line-strong bg-chip font-mono text-[12px] text-hint transition-colors hover:border-acc"
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
