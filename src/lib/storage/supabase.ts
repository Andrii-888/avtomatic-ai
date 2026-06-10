import { StorageProvider } from "./types";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const BUCKET = process.env.SUPABASE_BUCKET || "avtomatic-ai";

export class SupabaseStorageProvider implements StorageProvider {
  async upload(
    file: File | Blob | Buffer,
    metadata: { filename: string; contentType: string; size?: number }
  ): Promise<{ key: string; url: string }> {
    const key = `${Date.now()}-${metadata.filename}`;

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
}
