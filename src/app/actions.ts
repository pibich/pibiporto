"use server";

import { after } from "next/server";
import { sendContactNotification } from "@/lib/email";
import { createClient } from "@/lib/supabase/server";

export type ContactState = { ok: boolean; error?: string };

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Semua kolom wajib diisi." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .insert({ name, email, message });

  if (error) {
    console.error("sendMessage:", error.message);
    return { ok: false, error: "Gagal mengirim pesan. Coba lagi." };
  }

  // Notify by email after the response is sent, so the visitor isn't blocked.
  // The message is already saved above, so a failed email never loses data.
  after(() => sendContactNotification({ name, email, message }));

  return { ok: true };
}
