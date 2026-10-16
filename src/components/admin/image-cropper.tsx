"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { cropToHdFile, loadImage } from "@/lib/crop-image";

/**
 * Full-screen dialog to position & zoom an image inside a fixed 16:9 frame.
 * Confirming returns a cropped 1920×1080 File ready for upload.
 */
export function ImageCropper({
  src,
  onConfirm,
  onCancel,
}: {
  src: string;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = useCallback(async () => {
    if (!area) return;
    setBusy(true);
    setError(null);
    try {
      const img = await loadImage(src);
      const file = await cropToHdFile(img, area);
      onConfirm(file);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }, [area, src, onConfirm]);

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Tutup crop"
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-[rgba(5,7,10,0.7)]"
      />
      <div className="relative w-[560px] max-w-full rounded-2xl border border-line-input bg-panel p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] font-bold">atur tampilan screenshot</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            tutup
          </button>
        </div>
        <p className="mt-1 text-[11px] text-hint">
          geser &amp; zoom, tampilan selalu 16:9 (HD 1920×1080)
        </p>

        <div className="relative mt-4 h-[300px] w-full overflow-hidden rounded-xl border border-line bg-bg">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        </div>

        <label className="mt-4 flex items-center gap-3 text-[11.5px] text-muted">
          zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-acc"
          />
        </label>

        {error && <div className="mt-3 text-[12px] text-danger">{error}</div>}

        <div className="mt-4 flex justify-end gap-[10px]">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-line-input px-[18px] py-[11px] text-[13px] text-muted transition-colors hover:text-ink"
          >
            batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || !area}
            className="rounded-lg bg-acc px-[18px] py-[11px] text-[13px] font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
          >
            {busy ? "memproses…" : "pakai gambar"}
          </button>
        </div>
      </div>
    </div>
  );
}
