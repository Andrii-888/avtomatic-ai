import { en, type MessageKey } from "./en";
import { it } from "./it";
import { de } from "./de";
import { fr } from "./fr";
import { ru } from "./ru";

export type Locale = "en" | "it" | "de" | "fr" | "ru";

export const messages: Record<Locale, Record<MessageKey, string>> = {
  en,
  it,
  de,
  fr,
  ru,
};

// Display metadata for the language switcher (native names).
export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "it", label: "Italiano", short: "IT" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "ru", label: "Русский", short: "RU" },
];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && ["en", "it", "de", "fr", "ru"].includes(value);
}

export type { MessageKey };
