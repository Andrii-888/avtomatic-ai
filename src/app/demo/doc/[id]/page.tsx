"use client";

import { use, useEffect, useState } from "react";
import {
  FileText,
  ArrowLeft,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

interface ExtractionData {
  documentType: string;
  language: string;
  confidence: number;
  summary: string;
  entities: Record<string, unknown>;
}

interface Extraction {
  id: string;
  documentId: string;
  data: ExtractionData;
}

interface Document {
  id: string;
  title: string;
  type: string | null;
  summary: string | null;
  content: string | null;
  blobUrl: string | null;
  fileUrl?: string | null;
  status: string;
  createdAt: string;
  extractions?: Extraction[];
}

const LANGUAGE_NAMES: Record<string, string> = {
  it: "Italian",
  de: "German",
  en: "English",
  fr: "French",
  ru: "Russian",
  other: "Other",
};

function formatEntityValue(value: unknown) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-sm text-muted-foreground">—</span>;
    }
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((v, i) => (
          <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {typeof v === "object" ? JSON.stringify(v) : String(v)}
          </span>
        ))}
      </div>
    );
  }
  if (value === null || value === undefined || value === "") {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  if (typeof value === "object") {
    return (
      <span className="text-sm wrap-break-words">{JSON.stringify(value)}</span>
    );
  }
  return <span className="text-sm wrap-break-words">{String(value)}</span>;
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
            res.status === 404
              ? "Document not found"
              : "Failed to load document"
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

  const fileUrl = document?.fileUrl ?? document?.blobUrl ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Nav */}
      <nav className="flex items-center justify-between gap-3 border-b px-6 sm:px-10 h-16">
        <Logo />
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

            {fileUrl && (
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition hover:bg-muted sm:flex-none"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Open</span>
                </a>
                <a
                  href={fileUrl}
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
            {fileUrl ? (
              <object
                data={fileUrl}
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
                    href={fileUrl}
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

          {/* AI Analysis (if present) */}
          {document.extractions && document.extractions.length > 0 && (
            <div className="border-t px-4 py-4 sm:px-6">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Analysis
              </h2>

              {(() => {
                const data = document.extractions[0].data;
                const confidencePct = Math.round((data.confidence ?? 0) * 100);

                return (
                  <div className="flex flex-col gap-4">
                    {/* Meta cards */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-xl border p-4">
                        <p className="text-xs text-muted-foreground">
                          Document type
                        </p>
                        <p className="mt-1 text-sm font-medium capitalize">
                          {data.documentType}
                        </p>
                      </div>

                      <div className="rounded-xl border p-4">
                        <p className="text-xs text-muted-foreground">
                          Language
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {LANGUAGE_NAMES[data.language] || data.language}
                        </p>
                      </div>

                      <div className="rounded-xl border p-4">
                        <p className="text-xs text-muted-foreground">
                          Confidence
                        </p>
                        <p className="mt-1 text-sm font-medium">
                          {confidencePct}%
                        </p>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${confidencePct}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Entities */}
                    {data.entities && Object.keys(data.entities).length > 0 && (
                      <div className="rounded-xl border p-4">
                        <p className="mb-3 text-xs font-medium text-muted-foreground">
                          Extracted entities
                        </p>
                        <dl className="grid gap-4 sm:grid-cols-2">
                          {Object.entries(data.entities).map(([key, value]) => (
                            <div key={key} className="min-w-0">
                              <dt className="text-xs capitalize text-muted-foreground">
                                {key}
                              </dt>
                              <dd className="mt-1">
                                {formatEntityValue(value)}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
