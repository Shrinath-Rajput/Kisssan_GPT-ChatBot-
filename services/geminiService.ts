import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ SAFETY CHECK
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ SAFE JSON PARSER
function extractJSON(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Empty response from Gemini");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("No JSON found");
    }

    return JSON.parse(cleaned.substring(start, end + 1));

  } catch (err) {
    console.log("⚠️ JSON parse failed:", err.message);

    // ✅ ALWAYS SAFE RETURN
    return {
      disease: "Unknown",
      confidence: "0%",
      treatment: "Upload clearer image",
      analysis: "AI response parsing failed"
    };
  }
}

export const analyzeCropHealthService = async (imageBase64) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    // ✅ STRICT PROMPT (VERY IMPORTANT 🔥)
    const prompt = `
You are an agriculture expert AI.

Analyze the crop image and return ONLY valid JSON.

Do NOT add explanation.
Do NOT add markdown.

Return format:

{
  "disease": "string",
  "confidence": "string",
  "treatment": "string",
  "analysis": "string"
}
`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      },
    ]);

    // ✅ ULTRA SAFE ACCESS
    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("🧠 Gemini raw response:", text);

    // ❌ EMPTY RESPONSE HANDLE
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    return extractJSON(text);

  } catch (error) {
    console.error("❌ Gemini Error:", error.message);

    // ✅ FINAL FALLBACK (NEVER BREAK FRONTEND)
    return {
      disease: "Unknown",
      confidence: "0%",
      treatment: "Server busy, try again",
      analysis: "AI service unavailable"
    };
  }
};