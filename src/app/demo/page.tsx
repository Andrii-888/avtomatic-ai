"use client";

import { useEffect, useState, useRef } from "react";
import { FileText, Upload, Search, Loader2 } from "lucide-react";
import Link from "next/link";

interface Document {
  id: string;
  title: string;
  type: string | null;
  status: string;
  createdAt: string;
}

export default function DemoPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    const res = await fetch("/api/documents");
    const data = await res.json();
    setDocuments(data.documents || []);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      await fetchDocuments();
    }
    setUploading(false);
  };

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <nav className="border-b px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Avtomatic.AI
        </Link>
        <span className="text-sm text-muted-foreground">
          AI Document Assistant
        </span>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-muted/40 p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm">Documents</span>
            <span className="text-xs text-muted-foreground">
              {documents.length}
            </span>
          </div>

          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              No documents yet
            </p>
          )}

          {filtered.map((doc) => (
            <Link
              key={doc.id}
              href={`/demo/doc/${doc.id}`}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer transition"
            >
              <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="overflow-hidden">
                <p className="text-sm truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.type || doc.status}
                </p>
              </div>
            </Link>
          ))}

          {/* Upload button */}
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
            {uploading ? "Uploading..." : "Upload Document"}
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
        <main className="flex-1 p-8 flex flex-col gap-6">
          {/* Search */}
          <div className="flex items-center gap-2 border rounded-md px-4 py-2 max-w-xl">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              className="flex-1 bg-transparent outline-none text-sm"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Empty state */}
          {documents.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center">
              <FileText className="w-12 h-12 text-muted-foreground" />
              <h2 className="text-xl font-semibold">No documents yet</h2>
              <p className="text-muted-foreground text-sm">
                Upload a PDF to get started
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
              >
                Upload your first document
              </button>
            </div>
          )}

          {/* Documents grid */}
          {documents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
              {filtered.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/demo/doc/${doc.id}`}
                  className="border rounded-xl p-4 hover:border-primary transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5" />
                    <p className="text-sm font-medium truncate">{doc.title}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {doc.type || "Document"}
                    </span>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                      {doc.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
