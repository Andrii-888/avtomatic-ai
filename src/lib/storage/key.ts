/**
 * Build a safe, unique storage key from an uploaded filename.
 * Strips any path, replaces unsafe characters, and caps the length so the
 * raw user-provided name can't break object keys or public URLs.
 */
export function buildStorageKey(filename: string): string {
  const base = filename.split(/[\\/]/).pop() || "file";
  const safe = base
    .replace(/[^a-zA-Z0-9.\-_]+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^[_.]+/, "")
    .slice(-100);
  return `${Date.now()}-${safe || "file"}`;
}
