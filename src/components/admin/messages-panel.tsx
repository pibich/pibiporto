"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FiInbox, FiMail, FiTrash2 } from "react-icons/fi";
import { deleteMessage } from "@/app/admin/actions";
import type { Message } from "@/lib/types";

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function MessagesPanel({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus pesan dari "${name}"?`)) return;
    startTransition(async () => {
      await deleteMessage(id);
      router.refresh();
    });
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-ink">
              Pesan Masuk
            </h1>
            <span className="rounded-full bg-acc/10 px-2.5 py-0.5 text-xs font-semibold text-acc border border-acc/20">
              {messages.length}
            </span>
          </div>
          <p className="mt-1.5 text-[13px] text-muted">
            Pesan yang dikirimkan oleh pengunjung melalui form kontak homepage.
          </p>
        </div>
      </div>

      {/* Messages List */}
      <div className="mt-8 flex flex-col gap-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-line-dashed bg-panel/40 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-chip text-muted">
              <FiInbox className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-ink">
              Belum Ada Pesan Masuk
            </h3>
            <p className="mt-1 text-sm text-muted max-w-sm">
              Semua pesan dari form kontak di website akan muncul di sini secara
              otomatis.
            </p>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="group relative flex flex-col gap-3.5 rounded-2xl border border-line bg-panel p-5 transition-all hover:border-line-hover hover:shadow-lg hover:shadow-black/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-acc/10 font-mono text-sm font-bold text-acc">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{m.name}</h3>
                    <a
                      href={`mailto:${m.email}?subject=Re:%20Portofolio`}
                      className="text-xs text-muted transition-colors hover:text-acc hover:underline"
                    >
                      {m.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-hint">
                    {dateFmt.format(new Date(m.created_at))}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`mailto:${m.email}?subject=Re:%20Portofolio`}
                      className="inline-flex items-center gap-1 rounded-lg border border-line-input bg-bg px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-acc/40 hover:text-acc"
                      title="Balas via email client"
                    >
                      <FiMail className="h-3 w-3" />
                      <span>Balas</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(m.id, m.name)}
                      disabled={pending}
                      title="Hapus pesan"
                      className="inline-flex items-center gap-1 rounded-lg border border-danger/30 bg-bg px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
                    >
                      <FiTrash2 className="h-3 w-3" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-prose leading-relaxed whitespace-pre-wrap pl-1">
                {m.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
