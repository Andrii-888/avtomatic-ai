import { StorageProvider } from "./types";

export async function getStorageProvider(): Promise<StorageProvider> {
  const provider = process.env.STORAGE_PROVIDER || "local";

  if (provider === "r2") {
    const { R2StorageProvider } = await import("./r2");
    return new R2StorageProvider();
  }

  if (provider === "supabase") {
    const { SupabaseStorageProvider } = await import("./supabase");
    return new SupabaseStorageProvider();
  }

  const { LocalStorageProvider } = await import("./local");
  return new LocalStorageProvider();
}
