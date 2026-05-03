// ✅ FRONTEND SAFE GEMINI SERVICE (FINAL WORKING)

import { AppContextData, Language, DiseaseResult } from "../types";
import { 
  sendChatToBackend, 
  analyzeCropViaBackend, 
  getLocationDataViaBackend,
  checkBackendHealth 
} from "./apiClient";

// ================= BACKEND CHECK =================
checkBackendHealth().then((ok) => {
  if (ok) console.log("✅ Backend connected");
  else console.warn("⚠️ Backend not reachable");
});


// ================= WEATHER + SOIL =================
export const getLiveContextData = async (
  locationInput: { lat: number; long: number } | string
): Promise<AppContextData | null> => {
  try {
    console.log("📍 Fetching location data...");

    const data = await getLocationDataViaBackend(locationInput);

    // ✅ SAFE CHECK
    if (!data) throw new Error("No data");

    return data as AppContextData;

  } catch (error) {
    console.error("❌ Location error:", error);

    // ✅ fallback
    return {
      weather: {
        temp: 27,
        condition: "Partly Cloudy",
        rainForecast: "Light rain expected",
        location: typeof locationInput === "string" ? locationInput : "Your Location"
      },
      soil: {
        type: "Black Soil",
        nitrogen: "Medium",
        moisture: "Moderate"
      }
    };
  }
};


// ================= ANALYZE =================
export const analyzeCropHealth = async (
  imageBase64: string,
  language: Language,
  contextData: AppContextData
): Promise<DiseaseResult | string> => {
  try {
    console.log("🔍 Sending image to backend...");

    const result = await analyzeCropViaBackend(
      imageBase64,
      language,
      contextData
    );

    console.log("✅ Backend response:", result);

    // 🔥 VERY IMPORTANT FIX
    if (!result || typeof result !== "object") {
      throw new Error("Invalid backend response");
    }

    // 🔥 fallback if missing fields
    if (!(result as any).analysis) {
      return {
        disease: (result as any)?.disease || "Unknown",
        confidence: (result as any)?.confidence || "0%",
        treatment: (result as any)?.treatment || "Try again",
        analysis: "AI response incomplete"
      };
    }

    return result as DiseaseResult;

  } catch (error: any) {
    console.error("❌ Analyze error:", error);

    const msg = error?.message || "";

    if (msg.includes("Failed to fetch") || msg.includes("Network")) {
      return "❌ Cannot connect to backend. Check Railway deployment.";
    }

    if (msg.includes("429")) {
      return "⚠️ Server busy. Try again later.";
    }

    if (msg.includes("Invalid")) {
      return "⚠️ Server returned invalid data. Try again.";
    }

    return "❌ Analysis failed. Try again.";
  }
};


// ================= CHAT =================
export const sendMessageToGemini = async (
  prompt: string,
  imageBase64: string | undefined,
  language: Language,
  contextData: AppContextData
): Promise<string> => {
  try {
    console.log("💬 Sending chat request...");

    const res = await sendChatToBackend(
      prompt,
      imageBase64,
      language,
      contextData
    );

    if (!res) throw new Error("Empty response");

    return res;

  } catch (error: any) {
    console.error("❌ Chat error:", error);

    const msg = error?.message || "";

    if (msg.includes("Failed to fetch")) {
      return "❌ Backend not reachable.";
    }

    if (msg.includes("429")) {
      return "⚠️ Too many requests. Try later.";
    }

    return "❌ Chat failed.";
  }
};