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
  /**
   * Return a time-limited URL for reading a private object.
   * @param expiresIn lifetime in seconds (default 1 hour)
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
}
