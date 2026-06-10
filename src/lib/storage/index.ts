import { StorageProvider } from "./types";

export function getStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER || "local";

  if (provider === "r2") {
    const { R2StorageProvider } = require("./r2");
    return new R2StorageProvider();
  }

  const { LocalStorageProvider } = require("./local");
  return new LocalStorageProvider();
}
