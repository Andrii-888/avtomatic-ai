import { z } from "zod";

export const DocumentAnalysisSchema = z.object({
  documentType: z.enum(["invoice", "contract", "cv", "certificate", "other"]),
  language: z.enum(["it", "de", "en", "fr", "ru", "other"]),
  confidence: z.number().min(0).max(1),
  summary: z.string(),
  entities: z.record(z.string(), z.unknown()),
});

export type DocumentAnalysis = z.infer<typeof DocumentAnalysisSchema>;

export interface AIProvider {
  analyzeDocument(input: {
    text: string;
    filename: string;
  }): Promise<DocumentAnalysis>;
}
