"use client";

import { use, useEffect, useState } from "react";
import {
  FileText,
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  type: string | null;
  summary: string | null;
  content: string | null;
  blobUrl: string | null;
  status: string;
  createdAt: string;
}

export default function DocumentViewerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/documents/${id}`);
        if (!res.ok) {
          throw new Error(
            res.status === 404 ? "Document not found" : "Failed to load document"
          );
        }
        const data = await res.json();
        if (active) setDocument(data.document);
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between gap-3 border-b px-6 h-16">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Avtomatic.AI
        </Link>
        <Link
          href="/demo"
          className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Back to documents</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </nav>

      {/* Loading */}
      {loading && (
        <div className="flex flex-1 items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h2 className="text-lg font-semibold sm:text-xl">{error}</h2>
          <Link
            href="/demo"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Back to documents
          </Link>
        </div>
      )}

      {/* Content */}
      {!loading && !error && document && (
        <div className="flex flex-1 flex-col">
          {/* Header */}
          <div className="flex flex-col gap-3 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <FileText className="h-5 w-5 shrink-0" />
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold sm:text-lg">
                  {document.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  {document.type || "Document"} ·{" "}
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    {document.status}
                  </span>
                </p>
              </div>
            </div>

            {document.blobUrl && (
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={document.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted sm:flex-none"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Open</span>
                </a>
                <a
                  href={document.blobUrl}
                  download={document.title}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 sm:flex-none"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            )}
          </div>

          {/* PDF viewer */}
          <div className="flex-1 p-4 sm:p-6">
            {document.blobUrl ? (
              <object
                data={document.blobUrl}
                type="application/pdf"
                className="h-[60vh] w-full rounded-lg border bg-muted/30 sm:h-[75vh] lg:h-[80vh]"
              >
                {/* Fallback for browsers / mobile that can't embed PDFs */}
                <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Preview isn&apos;t available on this device.
                  </p>
                  <a
                    href={document.blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    Open PDF
                  </a>
                </div>
              </object>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No file attached to this document.
                </p>
              </div>
            )}
          </div>

          {/* Summary (if present) */}
          {document.summary && (
            <div className="border-t px-4 py-4 sm:px-6">
              <h2 className="mb-2 text-sm font-semibold">Summary</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {document.summary}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
