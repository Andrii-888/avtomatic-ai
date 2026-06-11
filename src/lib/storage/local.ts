import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { StorageProvider } from "./types";
import { buildStorageKey } from "./key";

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public/uploads");
    this.baseUrl = "/uploads";
  }

  async upload(
    file: File | Blob | Buffer,
    metadata: { filename: string; contentType: string; size?: number }
  ): Promise<{ key: string; url: string }> {
    await mkdir(this.uploadDir, { recursive: true });

    const key = buildStorageKey(metadata.filename);
    const filepath = path.join(this.uploadDir, key);

    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else {
      const arrayBuffer = await (file as Blob).arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    await writeFile(filepath, buffer);

    return {
      key,
      url: `${this.baseUrl}/${key}`,
    };
  }

  async delete(key: string): Promise<void> {
    const filepath = path.join(this.uploadDir, key);
    await unlink(filepath);
  }

  async getUrl(key: string): Promise<string> {
    return `${this.baseUrl}/${key}`;
  }

  async getSignedUrl(key: string): Promise<string> {
    // Local dev files are served statically from /public — no signing needed.
    return `${this.baseUrl}/${key}`;
  }
}
