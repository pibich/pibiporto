"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiLock,
  FiMail,
  FiShield,
} from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // Sudah login? Langsung ke /admin tanpa perlu isi form lagi.
  useEffect(() => {
    let active = true;
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        if (active && user) router.replace("/admin");
      });
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError("Email atau kata sandi tidak cocok. Silakan coba lagi.");
      setPending(false);
      return;
    }

    const redirect =
      new URLSearchParams(window.location.search).get("redirect") || "/admin";
    router.replace(redirect);
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg px-6 py-12 text-ink selection:bg-acc selection:text-bg">
      <div className="w-full max-w-[420px]">
        {/* Header Terminal Brand */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1 text-xs font-mono text-muted">
            <span className="flex h-1.5 w-1.5 rounded-full bg-acc" />
            <span>$ sudo auth login</span>
            <span className="inline-block h-3.5 w-1.5 animate-[blink_1.1s_step-end_infinite] bg-acc" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-[28px] font-bold tracking-tight text-ink">
            Admin Dashboard
          </h1>
          <p className="mt-1.5 text-xs text-muted">
            Masuk dengan kredensial administrator portofolio Anda.
          </p>
        </div>

        {/* Login Form Box */}
        <form
          onSubmit={handleSubmit}
          className="mt-7 flex flex-col gap-4 rounded-2xl border border-line bg-panel p-6 sm:p-7 shadow-2xl"
        >
          {error && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs text-danger leading-relaxed">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-muted uppercase tracking-wider"
              htmlFor="email"
            >
              Email Administrator
            </label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full rounded-xl border border-line-input bg-bg pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-hint outline-none transition-all focus:border-acc focus:ring-1 focus:ring-acc"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-muted uppercase tracking-wider"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hint" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-line-input bg-bg pl-10 pr-10 py-2.5 text-sm text-ink placeholder:text-hint outline-none transition-all focus:border-acc focus:ring-1 focus:ring-acc"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-hint hover:text-ink transition-colors"
                title={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-acc py-3 text-center text-sm font-semibold text-bg transition-all hover:opacity-90 hover:shadow-lg hover:shadow-acc/20 disabled:opacity-60"
          >
            {pending ? (
              <>
                <FiLoader className="h-4 w-4 animate-spin" />
                <span>Memverifikasi akun…</span>
              </>
            ) : (
              <>
                <FiShield className="h-4 w-4" />
                <span>Masuk ke Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink"
          >
            <FiArrowLeft className="h-3 w-3" />
            <span>Kembali ke homepage portofolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
