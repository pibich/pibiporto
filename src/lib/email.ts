import { Resend } from "resend";

export type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

// Resend's shared testing sender — works without a verified domain. On the
// free tier the recipient (CONTACT_EMAIL) must be the email your Resend
// account is registered with. Verify a domain later to send from your own.
const FROM = "Portfolio <onboarding@resend.dev>";

/**
 * Sends a contact-form submission to the site owner's inbox via Resend.
 * Best-effort: if the API key/recipient is missing or the send fails, it logs
 * and returns without throwing — the message is already stored in the database.
 */
export async function sendContactNotification(
  msg: ContactMessage,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;

  if (!apiKey || !to) {
    console.warn(
      "sendContactNotification: RESEND_API_KEY / CONTACT_EMAIL belum diset; email dilewati.",
    );
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to,
      replyTo: msg.email, // reply goes straight to the visitor
      subject: `Pesan baru dari ${msg.name} · portofolio`,
      text: `Nama  : ${msg.name}\nEmail : ${msg.email}\n\n${msg.message}`,
    });
    if (error) {
      console.error("sendContactNotification:", error);
    }
  } catch (e) {
    console.error("sendContactNotification:", (e as Error).message);
  }
}
