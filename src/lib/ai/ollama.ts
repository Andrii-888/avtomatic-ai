import { AIProvider, DocumentAnalysis, DocumentAnalysisSchema } from "./types";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

export class OllamaProvider implements AIProvider {
  async analyzeDocument(input: {
    text: string;
    filename: string;
  }): Promise<DocumentAnalysis> {
    console.log("[OLLAMA] Analyzing:", input.filename, "length:", input.text.length);

    const prompt = `You are a document analysis assistant. Analyze the following document and return ONLY a JSON object with no explanation, no markdown, no code blocks.

Document filename: ${input.filename}
Document text:
${input.text.slice(0, 3000)}

Return this exact JSON structure:
{
  "documentType": "cv",
  "language": "en",
  "confidence": 0.95,
  "summary": "brief summary in English",
  "entities": {
    "name": "John Smith",
    "email": "john@example.com",
    "skills": ["React", "Node.js"]
  }
}`;

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        format: "json",
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);

    const data = await response.json();
    console.log("[OLLAMA] Response:", data.response);

    const raw = JSON.parse(data.response);
    const result = DocumentAnalysisSchema.parse(raw);
    console.log("[OLLAMA] Result:", result);
    return result;
  }

  async chat(input: { content: string; message: string }): Promise<string> {
    const prompt = `You are a helpful assistant answering questions about this document. Document content: ${input.content.slice(
      0,
      6000
    )}. Question: ${input.message}. Answer concisely based only on the document content.`;

    const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.status}`);

    const data = await response.json();
    return String(data.response ?? "").trim();
  }
}
