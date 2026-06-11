import { AIProvider } from "./types";
import { OllamaProvider } from "./ollama";

export function getAIProvider(): AIProvider | null {
  const provider = process.env.AI_PROVIDER;

  // No provider configured (e.g. on Vercel) — skip AI analysis gracefully.
  if (!provider || provider === "none") {
    return null;
  }

  if (provider === "ollama") {
    return new OllamaProvider();
  }

  throw new Error(`Unknown AI provider: ${provider}`);
}
