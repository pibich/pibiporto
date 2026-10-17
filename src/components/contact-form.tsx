"use client";

import { useActionState, useState } from "react";
import {
  FiCheckCircle,
  FiLoader,
  FiMail,
  FiMessageSquare,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { type ContactState, sendMessage } from "@/app/actions";

const inputClass =
  "w-full rounded-xl border border-line-input bg-bg pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-hint outline-none transition-all focus:border-acc focus:ring-1 focus:ring-acc";
const labelClass = "text-xs font-mono font-semibold text-muted";

const initial: ContactState = { ok: false };

export function ContactForm() {
  const [resetKey, setResetKey] = useState(0);
  return (
    <ContactFormInner
      key={resetKey}
      onReset={() => setResetKey((k) => k + 1)}
    />
  );
}

function ContactFormInner({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(sendMessage, initial);

  if (state.ok) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3.5 text-center p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
          <FiCheckCircle className="h-6 w-6 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="font-mono text-base font-bold text-ink">
            $ pesan terkirim ✓
          </h3>
          <p className="mt-1 text-sm text-muted max-w-xs">
            Terima kasih telah menghubungi! Pesan Anda sudah tersimpan dan saya
            akan membalas secepatnya.
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="mt-2 rounded-xl border border-line-input bg-bg px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-line-hover hover:text-ink"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs font-mono text-danger">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="contact-name">
          {"// nama"}
        </label>
        <div className="relative">
          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Nama lengkap Anda"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="contact-email">
          {"// email"}
        </label>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="nama@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass} htmlFor="contact-message">
          {"// pesan"}
        </label>
        <div className="relative">
          <FiMessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-hint" />
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            required
            placeholder="Ceritakan ide project, tawaran kerja sama, atau pertanyaan Anda…"
            className={`${inputClass} pt-3 pl-10 resize-y leading-relaxed`}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-acc py-3 font-mono text-xs sm:text-sm font-semibold text-bg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-acc/20 active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? (
          <>
            <FiLoader className="h-4 w-4 animate-spin" />
            <span>$ mengirim pesan…</span>
          </>
        ) : (
          <>
            <FiSend className="h-4 w-4" />
            <span>$ kirim pesan</span>
          </>
        )}
      </button>
    </form>
  );
}
