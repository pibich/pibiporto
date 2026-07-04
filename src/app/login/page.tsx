"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "rounded-lg border border-line-input bg-bg px-[14px] py-3 font-sans text-[14.5px] text-ink outline-none focus:border-acc";
const labelClass = "font-mono text-[11.5px] text-muted";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email atau password salah.");
      setPending(false);
      return;
    }

    const redirect =
      new URLSearchParams(window.location.search).get("redirect") || "/admin";
    router.replace(redirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-7">
      <div className="w-[400px] max-w-full">
        <div className="text-center">
          <div className="font-mono text-sm text-muted">
            $ sudo login
            <span className="ml-1 inline-block h-4 w-2 translate-y-[2px] animate-[blink_1.1s_step-end_infinite] bg-acc" />
          </div>
          <h1 className="mt-[14px] text-[28px] font-bold tracking-[-0.01em]">
            Area Admin
          </h1>
          <p className="mt-2 text-sm text-muted">
            Masuk untuk mengelola portofolio.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col gap-4 rounded-[14px] border border-line bg-panel p-7"
        >
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass} htmlFor="email">
              email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className={labelClass} htmlFor="password">
              password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </div>
          {error && (
            <div className="font-mono text-[12px] text-danger">{error}</div>
          )}
          <button
            type="submit"
            disabled={pending}
            className="mt-1 rounded-lg bg-acc py-[13px] text-center font-mono text-[13.5px] font-semibold text-bg transition-opacity hover:opacity-85 disabled:opacity-60"
          >
            {pending ? "Memproses…" : "Masuk →"}
          </button>
        </form>

        <div className="mt-5 text-center font-mono text-[11.5px] leading-[1.7] text-hint">
          <Link
            href="/"
            className="text-muted transition-colors hover:text-ink"
          >
            ← kembali ke homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
