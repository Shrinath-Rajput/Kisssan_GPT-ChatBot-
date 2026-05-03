// ✅ FRONTEND SAFE VERSION (NO GEMINI SDK)

import { AppContextData, Language, DiseaseResult } from "../types";
import { analyzeCropViaBackend } from "./apiClient";

export const analyzeCropHealth = async (
  imageBase64: string,
  language: Language,
  contextData: AppContextData
): Promise<DiseaseResult | string> => {
  try {
    const result = await analyzeCropViaBackend(
      imageBase64,
      language,
      contextData
    );

    return result;

  } catch (error: any) {
    console.error("Frontend Error:", error);

    return "❌ Backend error. Please try again.";
  }
};