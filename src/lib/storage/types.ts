export interface StorageProvider {
  upload(
    file: File | Blob | Buffer,
    metadata: {
      filename: string;
      contentType: string;
      size?: number;
    }
  ): Promise<{ key: string; url: string }>;

  delete(key: string): Promise<void>;
  getUrl(key: string): Promise<string>;
}
