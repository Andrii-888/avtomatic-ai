import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

async function login(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  const expected = process.env.DEMO_PASSWORD;

  if (expected && password === expected) {
    const store = await cookies();
    store.set("demo-auth", expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    redirect("/");
  }

  redirect("/login?error=1");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border bg-card">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-5 text-xl font-semibold tracking-tight">
            Avtomatic.AI
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter the password to access the demo.
          </p>
        </div>

        <form action={login} className="flex flex-col gap-3">
          <input
            type="password"
            name="password"
            autoFocus
            required
            placeholder="Password"
            aria-label="Password"
            className="w-full rounded-lg border bg-card px-4 py-2.5 text-sm outline-none transition focus:border-primary"
          />

          {error && (
            <p className="text-sm text-red-600">Incorrect password.</p>
          )}

          <button
            type="submit"
            className="mt-1 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
