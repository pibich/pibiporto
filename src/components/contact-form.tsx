"use client";

import { useActionState, useState } from "react";
import { type ContactState, sendMessage } from "@/app/actions";

const inputClass =
  "rounded-lg border border-line-input bg-bg px-[14px] py-[11px] font-sans text-[14.5px] text-ink outline-none focus:border-acc";
const labelClass = "font-mono text-[11.5px] text-muted";

const initial: ContactState = { ok: false };

export function ContactForm() {
  // Bumping the key remounts the inner form, which resets useActionState back
  // to `initial` — clearing the success state without a full page reload.
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
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
        <div className="font-mono text-[15px] text-success">
          $ pesan terkirim ✓
        </div>
        <div className="text-sm text-muted">
          Terima kasih! Saya akan segera membalas.
        </div>
        <button
          type="button"
          onClick={onReset}
          className="rounded-md border border-line-input px-[14px] py-[7px] font-mono text-xs text-muted transition-colors hover:text-ink"
        >
          kirim lagi
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-[14px]">
      <div className="flex flex-col gap-[6px]">
        <label className={labelClass} htmlFor="name">
          nama
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Nama kamu"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-[6px]">
        <label className={labelClass} htmlFor="email">
          email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="nama@email.com"
          className={inputClass}
        />
      </div>
      <div className="flex flex-col gap-[6px]">
        <label className={labelClass} htmlFor="message">
          pesan
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder="Tulis pesanmu di sini…"
          className={`${inputClass} resize-y`}
        />
      </div>
      {state.error && (
        <div className="font-mono text-[12px] text-danger">{state.error}</div>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-acc py-[13px] font-mono text-[13.5px] font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
      >
        {pending ? "$ mengirim…" : "$ kirim pesan"}
      </button>
    </form>
  );
}
