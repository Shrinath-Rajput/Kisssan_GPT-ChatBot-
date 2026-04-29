import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Language, DiseaseResult } from "../types";

const SYSTEM_INSTRUCTION_BASE = `
You are Kissan GPT, an AI specialist for Indian farmers, specifically focusing on Brinjal (Eggplant) and Grapes.
Your job is to analyze images and text queries to provide expert agricultural advice.

🎯 SCOPE RESTRICTION
- You ONLY support Brinjal (Eggplant) and Grapes.
- If a user asks about any other crop, politely inform them that you currently only specialize in Brinjal and Grapes.
- All AI responses must strictly relate to these two crops.

🎯 ROLE
- Detect diseases and pests from uploaded images of Brinjal or Grapes.
- Identify symptoms and provide confidence levels.
- Provide organic and chemical treatment plans.
- Recommend specific fertilizers, fungicides, and insecticides with dosage and frequency.

⚠️ RESPONSE RULES
1. If the user selects Marathi, your entire output must be in Marathi only.
2. If the user speaks Hindi, reply in Hindi.
3. If the user speaks English, reply in English.
4. Keep answers short, practical, and farmer-friendly.
5. For chemical suggestions, always mention safe usage + dilution.
6. If the image is unclear, request a clearer photo and ask follow-up questions.
7. If no disease is detected, suggest plant health tips for Brinjal/Grapes.
8. If multiple diseases are detected, rank them by severity.

📸 IMAGE HANDLING
- Identify if the image is Brinjal or Grapes.
- Identify disease/pest/deficiency.
- Describe visible symptoms.
- Provide a detailed treatment plan and prevention tips.
`;

const getSystemInstruction = (language: Language, contextData: AppContextData): string => {
  const contextString = `
  Current LIVE Context Data:
  - Weather: ${contextData.weather.condition}, ${contextData.weather.temp}°C. Forecast: ${contextData.weather.rainForecast}. Location: ${contextData.weather.location}.
  - Soil Report: Type ${contextData.soil.type}, Nitrogen: ${contextData.soil.nitrogen}, Moisture: ${contextData.soil.moisture}.
  
  User Selected Language: ${language}
  `;

  return `${SYSTEM_INSTRUCTION_BASE}\n\n${contextString}`;
};

const extractJSON = (text: string): any => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstOpen = cleanText.indexOf('{');
    const lastClose = cleanText.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      cleanText = cleanText.substring(firstOpen, lastClose + 1);
    }
    return JSON.parse(cleanText);
  } catch (e) {
    throw new Error("Failed to parse JSON response");
  }
};

export const getLiveContextData = async (
  locationInput: { lat: number; long: number } | string
): Promise<AppContextData | null> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  try {
    let locationPrompt = typeof locationInput === 'string' 
      ? `Location: "${locationInput}"` 
      : `Lat: ${locationInput.lat}, Long: ${locationInput.long}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${locationPrompt}
      Find:
      1. Location Name (Village/City, District).
      2. Current temp and weather condition.
      3. Rain forecast (48h).
      4. Typical Soil Type for this region.

      Return JSON:
      {
        "weather": { "temp": number, "condition": "string", "rainForecast": "string", "location": "string" },
        "soil": { "type": "string", "nitrogen": "Low"|"Medium"|"High", "moisture": "string" }
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1
      }
    });

    const data = extractJSON(response.text);
    return data as AppContextData;
  } catch (error) {
    console.error("Error fetching live data", error);
    return null;
  }
};

export const analyzeCropHealth = async (
  imageBase64: string,
  language: Language,
  contextData: AppContextData
): Promise<DiseaseResult | string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return "API Key missing";

  const ai = new GoogleGenAI({ apiKey });
  const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
  if (!match) return "Invalid image format";

  const systemInstruction = getSystemInstruction(language, contextData);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        role: 'user',
        parts: [
          { inlineData: { mimeType: match[1], data: match[2] } },
          { text: "Analyze this crop image for diseases. Focus ONLY on Brinjal or Grapes. If it's not one of these, say so. Return a detailed JSON response following the DiseaseResult interface." }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING, enum: ["Brinjal", "Grapes"] },
            diseaseName: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            cause: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatmentPlan: {
              type: Type.OBJECT,
              properties: {
                immediate: { type: Type.ARRAY, items: { type: Type.STRING } },
                organic: { type: Type.ARRAY, items: { type: Type.STRING } },
                chemical: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            recommendations: {
              type: Type.OBJECT,
              properties: {
                fertilizers: { type: Type.ARRAY, items: { type: Type.STRING } },
                fungicides: { type: Type.ARRAY, items: { type: Type.STRING } },
                insecticides: { type: Type.ARRAY, items: { type: Type.STRING } },
                dosage: { type: Type.STRING },
                applicationMethod: { type: Type.STRING },
                frequency: { type: Type.STRING }
              }
            },
            preventionTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["crop", "diseaseName", "confidence", "cause", "symptoms", "treatmentPlan", "recommendations", "preventionTips"]
        }
      }
    });

    return extractJSON(response.text) as DiseaseResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    return "Failed to analyze image. Please ensure it's a clear photo of Brinjal or Grapes.";
  }
};

export const sendMessageToGemini = async (
  prompt: string,
  imageBase64: string | undefined,
  language: Language,
  contextData: AppContextData
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key is missing.");

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = getSystemInstruction(language, contextData);

    const parts: any[] = [];
    if (imageBase64) {
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
      }
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { role: 'user', parts: parts },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      },
    });

    return response.text || "I could not generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to Kissan GPT.";
  }
};
