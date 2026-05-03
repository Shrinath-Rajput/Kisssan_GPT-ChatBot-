import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const jsonString = cleaned.substring(start, end + 1);

    return JSON.parse(jsonString);

  } catch (err) {
    console.log("⚠️ JSON parse failed, using fallback");

    return {
      disease: "Unknown",
      confidence: "0%",
      treatment: "Try uploading a clearer image",
      analysis: "AI could not analyze properly"
    };
  }
}

export const analyzeCropHealthService = async (imageBase64) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
    Analyze this crop image and return STRICT JSON format:

    {
      "disease": "",
      "confidence": "",
      "treatment": "",
      "analysis": ""
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

    // ✅ SAFE ACCESS
    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const parsed = extractJSON(text);

    return parsed;

  } catch (error) {
    console.error("❌ Gemini Error:", error);

    // ✅ ALWAYS RETURN (IMPORTANT)
    return {
      disease: "Unknown",
      confidence: "0%",
      treatment: "Server busy, try again",
      analysis: "Fallback response"
    };
  }
};