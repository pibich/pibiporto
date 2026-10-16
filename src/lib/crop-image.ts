/**
 * Crop a source image to a fixed 16:9 box and return it as an uploadable
 * File. Output is always 1920×1080 JPEG so every project screenshot has
 * identical dimensions in storage.
 */
export async function cropToHdFile(
  img: HTMLImageElement,
  pixelCrop: { x: number; y: number; width: number; height: number },
): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak didukung browser ini.");

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    img,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Gagal memproses gambar."))),
      "image/jpeg",
      0.92,
    );
  });
  return new File([blob], "screenshot.jpg", { type: "image/jpeg" });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar."));
    img.src = src;
  });
}
