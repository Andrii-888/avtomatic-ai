"use client";

import { useRef, useState } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { login } from "./actions";

export function LoginForm({ hasError }: { hasError: boolean }) {
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flash = () => {
    setPopup(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPopup(false), 3000);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!password.trim()) {
      e.preventDefault();
      flash();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      {/* Top-tier popup when the code is missing */}
      {popup && (
        <div className="pointer-events-none fixed left-1/2 top-6 z-50 -translate-x-1/2">
          <div className="reveal flex items-center gap-2 rounded-full border bg-card px-4 py-2.5 text-sm font-medium shadow-[0_16px_40px_-16px_rgba(0,0,0,0.45)]">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
            {t("login.required")}
          </div>
        </div>
      )}

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-card">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-xl font-semibold tracking-tight">
            Avtomatic.AI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("login.subtitle")}
          </p>
        </div>

        <form action={login} onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            placeholder={t("login.password")}
            aria-label={t("login.password")}
            className="w-full rounded-lg border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary"
          />

          {hasError && (
            <p className="text-sm text-red-600">{t("login.incorrect")}</p>
          )}

          <button
            type="submit"
            className="mt-1 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            {t("login.enter")}
          </button>
        </form>
      </div>
    </main>
  );
}
