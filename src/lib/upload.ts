import { createClient } from "@/lib/supabase/client";

/**
 * Uploads an image to a public Supabase Storage bucket from the browser and
 * returns its public URL. Used by the admin forms for project screenshots,
 * the profile picture, game banners, and testimonial screenshots.
 */
export async function uploadImage(
  file: File,
  bucket = "site-assets",
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: false });
  if (error) throw new Error(`Upload gambar gagal: ${error.message}`);
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
}
