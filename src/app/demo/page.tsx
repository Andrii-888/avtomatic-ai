"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { FileText, Upload, Search, Loader2, X, Zap } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/i18n/provider";

interface Document {
  id: string;
  title: string;
  type: string | null;
  status: string;
  createdAt: string;
}

const statusColor: Record<string, string> = {
  READY: "bg-green-100 text-green-700",
  PROCESSING: "bg-yellow-100 text-yellow-700",
  ERROR: "bg-red-100 text-red-700",
  UPLOADED: "bg-blue-100 text-blue-700",
};

export default function DemoPage() {
  const { t } = useI18n();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Active status-polling intervals, keyed by document id.
  const pollRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});
  const didMount = useRef(false);

  const fetchDocuments = async (q = "") => {
    const res = await fetch(`/api/documents?q=${encodeURIComponent(q)}`);
    if (!res.ok) return;
    const data = await res.json();
    setDocuments(data.documents || []);
  };

  const stopPolling = useCallback((id: string) => {
    const timer = pollRef.current[id];
    if (timer) {
      clearInterval(timer);
      delete pollRef.current[id];
    }
  }, []);

  // Poll a single document every 3s until it reaches a terminal state.
  const startPolling = useCallback(
    (id: string) => {
      if (pollRef.current[id]) return; // already polling
      pollRef.current[id] = setInterval(async () => {
        try {
          const res = await fetch(`/api/documents/${id}`);
          if (!res.ok) {
            stopPolling(id);
            return;
          }
          const { document } = await res.json();
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === id
                ? { ...d, status: document.status, type: document.type }
                : d
            )
          );
          if (document.status === "READY" || document.status === "ERROR") {
            stopPolling(id);
          }
        } catch {
          stopPolling(id);
        }
      }, 3000);
    },
    [stopPolling]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      const res = await fetch("/api/documents");
      const data = await res.json();
      if (!active) return;
      const docs: Document[] = data.documents || [];
      setDocuments(docs);
      // Resume polling for anything still processing (e.g. after a reload).
      docs.forEach((d) => {
        if (d.status === "PROCESSING") startPolling(d.id);
      });
    })();
    return () => {
      active = false;
    };
  }, [startPolling]);

  // Debounced server-side search (skips the initial mount load above).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const handle = setTimeout(() => {
      void fetchDocuments(search.trim());
    }, 300);
    return () => clearTimeout(handle);
  }, [search]);

  // Clear every interval on unmount.
  useEffect(() => {
    const timers = pollRef.current;
    return () => {
      Object.values(timers).forEach(clearInterval);
    };
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert(t("demo.fileTooLarge"));
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        await fetchDocuments(search.trim());
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || t("demo.uploadFailed"));
      }
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAnalyze = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Optimistically show processing, then poll until done.
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "PROCESSING" } : d))
    );
    try {
      await fetch(`/api/documents/${id}/process`, { method: "POST" });
    } catch {
      // Polling will reconcile the real state.
    }
    startPolling(id);
  };

  const hasQuery = search.trim().length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="border-b px-6 sm:px-10 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {t("nav.tagline")}
          </span>
          <LanguageSwitcher />
        </div>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar (desktop only) */}
        <aside className="hidden w-64 shrink-0 border-r bg-muted/40 p-4 lg:flex lg:flex-col lg:gap-2">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm">{t("demo.documents")}</span>
            <span className="text-xs text-muted-foreground">
              {documents.length}
            </span>
          </div>

          {documents.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              {hasQuery ? t("demo.noResults") : t("demo.noDocuments")}
            </p>
          )}

          {documents.map((doc) => (
            <Link
              key={doc.id}
              href={`/demo/doc/${doc.id}`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer transition"
            >
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="overflow-hidden flex-1">
                <p className="text-sm truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.type || t(`status.${doc.status}`)}
                </p>
              </div>
            </Link>
          ))}

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 flex items-center justify-center gap-2 border border-dashed rounded-md p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploading ? t("demo.uploading") : t("demo.uploadDocument")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleUpload}
          />
        </aside>

        {/* Main */}
        <main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-md border px-4 py-2 sm:max-w-xl">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                className="w-full flex-1 bg-transparent text-sm outline-none"
                placeholder={t("demo.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Upload (mobile only — sidebar is hidden) */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label={t("demo.uploadDocument")}
              className="flex shrink-0 items-center justify-center rounded-md bg-primary p-2.5 text-primary-foreground transition hover:opacity-90 disabled:opacity-50 lg:hidden"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </button>
          </div>

          {documents.length === 0 && hasQuery && (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center">
              <Search className="w-10 h-10 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{t("demo.noResults")}</h2>
            </div>
          )}

          {documents.length === 0 && !hasQuery && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
              <FileText className="w-12 h-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">{t("demo.noDocuments")}</h2>
              <p className="text-muted-foreground text-sm">
                {t("demo.emptySubtitle")}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
              >
                {t("demo.uploadFirst")}
              </button>
            </div>
          )}

          {documents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="relative group border rounded-xl p-4 hover:border-primary transition"
                >
                  {/* Крестик удаления */}
                  <button
                    onClick={(e) => handleDelete(e, doc.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <Link href={`/demo/doc/${doc.id}`} className="block">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5" />
                      <p className="text-sm font-medium truncate pr-4">
                        {doc.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {doc.type || t("status.document")}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          statusColor[doc.status] || "bg-muted"
                        }`}
                      >
                        {t(`status.${doc.status}`)}
                      </span>
                    </div>
                  </Link>

                  {/* Кнопка Analyze */}
                  {(doc.status === "UPLOADED" || doc.status === "ERROR") && (
                    <button
                      onClick={(e) => handleAnalyze(e, doc.id)}
                      className="mt-3 w-full flex items-center justify-center gap-2 text-xs border rounded-md py-1.5 hover:border-primary hover:text-primary transition"
                    >
                      <Zap className="w-3 h-3" />
                      {t("demo.analyze")}
                    </button>
                  )}

                  {/* Индикатор обработки во время polling */}
                  {doc.status === "PROCESSING" && (
                    <div className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-muted-foreground py-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {t("demo.analyzing")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
