import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="border-b px-6 h-16 flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">Avtomatic.AI</span>
        <Link
          href="/demo"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition"
        >
          Try Demo →
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Turn Contracts, Invoices and PDFs
          <br />
          into Structured Data with AI
        </h1>
        <p className="text-muted-foreground text-xl mb-10">
          Upload a document, extract key information, and ask questions in
          seconds.
        </p>
        <Link
          href="/demo"
          className="bg-primary text-primary-foreground px-8 py-4 rounded-md text-lg font-medium hover:opacity-90 transition"
        >
          Try AI Document Assistant
        </Link>
      </section>
    </main>
  );
}
