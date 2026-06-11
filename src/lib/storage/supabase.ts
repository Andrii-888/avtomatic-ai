import { StorageProvider } from "./types";
import { buildStorageKey } from "./key";
import { createClient } from "@supabase/supabase-js";

// Prefer the service-role key (server-side only) so signed URLs work on a
// private bucket; fall back to the anon key for public-bucket setups.
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

const BUCKET = process.env.SUPABASE_BUCKET || "avtomatic-ai";

export class SupabaseStorageProvider implements StorageProvider {
  async upload(
    file: File | Blob | Buffer,
    metadata: { filename: string; contentType: string; size?: number }
  ): Promise<{ key: string; url: string }> {
    const key = buildStorageKey(metadata.filename);

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(key, file, { contentType: metadata.contentType });

    if (error) throw new Error(`Supabase upload error: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);

    return { key, url: data.publicUrl };
  }

  async delete(key: string): Promise<void> {
    const { error } = await supabase.storage.from(BUCKET).remove([key]);
    if (error) throw new Error(`Supabase delete error: ${error.message}`);
  }

  async getUrl(key: string): Promise<string> {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
    return data.publicUrl;
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(key, expiresIn);

    if (error || !data) {
      throw new Error(
        `Supabase signed URL error: ${error?.message ?? "no data"}`
      );
    }

    return data.signedUrl;
  }
}
