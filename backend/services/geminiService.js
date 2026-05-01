import { GoogleGenerativeAI } from '@google/generative-ai';

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

const getSystemInstruction = (language, contextData) => {
  const contextString = `
  Current LIVE Context Data:
  - Weather: ${contextData?.weather?.condition || 'N/A'}, ${contextData?.weather?.temp || 'N/A'}°C. Forecast: ${contextData?.weather?.rainForecast || 'N/A'}. Location: ${contextData?.weather?.location || 'N/A'}.
  - Soil Report: Type ${contextData?.soil?.type || 'N/A'}, Nitrogen: ${contextData?.soil?.nitrogen || 'N/A'}, Moisture: ${contextData?.soil?.moisture || 'N/A'}.
  
  User Selected Language: ${language || 'English'}
  `;

  return `${SYSTEM_INSTRUCTION_BASE}\n\n${contextString}`;
};

const extractJSON = (text) => {
  try {
    let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstOpen = cleanText.indexOf('{');
    const lastClose = cleanText.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      cleanText = cleanText.substring(firstOpen, lastClose + 1);
    }
    return JSON.parse(cleanText);
  } catch (e) {
    throw new Error(`Failed to parse JSON response: ${e.message}`);
  }
};

const validateApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in backend environment variables');
  }
  return apiKey;
};

// Chat Service
export const sendChatMessage = async (prompt, imageBase64, language, contextData) => {
  try {
    const apiKey = validateApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const systemInstruction = getSystemInstruction(language, contextData);

    console.log(`🗣️ Chat Service Called - Language: ${language || 'English'}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 50)}...`);

    const parts = [];
    if (imageBase64) {
      const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
        console.log(`🖼️ Image attached: ${match[1]}`);
      }
    }
    parts.push({ text: prompt });

    const response = await Promise.race([
      model.generateContent({
        contents: [{ role: 'user', parts: parts }],
        generationConfig: {
          temperature: 0.4,
        },
        systemInstruction: systemInstruction,
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout after 15s')), 15000))
    ]);

    console.log(`✅ Chat message processed successfully in ${language || 'English'}`);
    return {
      success: true,
      message: response.text || 'I could not generate a response.',
      language: language || 'English'
    };
  } catch (error) {
    console.error('❌ Chat Service Error:', error);
    throw error;
  }
};

// Analysis Service
export const analyzeCropHealthService = async (imageBase64, language, contextData) => {
  try {
    const apiKey = validateApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const match = imageBase64.match(/^data:(.+);base64,(.+)$/);
    if (!match) {
      throw new Error('Invalid image format');
    }

    console.log(`🔍 Crop Analysis Started - Language: ${language || 'English'}`);
    console.log(`🖼️ Image type: ${match[1]}`);

    const systemInstruction = getSystemInstruction(language, contextData);

    const response = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: match[1], data: match[2] } },
          { text: 'Analyze this crop image for diseases. Focus ONLY on Brinjal or Grapes. If it\'s not one of these, say so. Return a detailed JSON response with keys: crop, diseaseName, confidence, cause, symptoms, treatmentPlan (with immediate, organic, chemical), and recommendations (with fertilizers, warnings).' }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
      },
      systemInstruction: systemInstruction,
    });

    console.log(`✅ Crop analysis completed successfully in ${language || 'English'}`);
    return {
      success: true,
      analysis: extractJSON(response.text),
      language: language || 'English'
    };
  } catch (error) {
    console.error('❌ Analysis Service Error:', error);
    throw error;
  }
};

// Location Data Service
export const getLocationContextData = async (locationInput) => {
  try {
    const apiKey = validateApiKey();
    const ai = new GoogleGenAI({ apiKey });

    let locationPrompt = typeof locationInput === 'string' 
      ? `Location: "${locationInput}"` 
      : `Lat: ${locationInput.lat}, Long: ${locationInput.long}`;
    
    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${locationPrompt}
        Find typical weather and soil data for this location:
        1. Location name (Village/City, District)
        2. Typical temperature and weather patterns
        3. General rain forecast pattern
        4. Typical soil type for region

        Return ONLY valid JSON (no markdown):
        {"weather": {"temp": 28, "condition": "Partly Cloudy", "rainForecast": "Light rain expected", "location": "City, District"}, "soil": {"type": "Black Soil", "nitrogen": "Medium", "moisture": "Moderate"}}`,
        config: {
          temperature: 0.3
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);

    const data = extractJSON(response.text);
    console.log('✅ Location data fetched successfully');
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('❌ Location Service Error:', error);
    // Return default data on error
    return {
      success: false,
      data: {
        weather: {
          temp: 27,
          condition: 'Partly Cloudy',
          rainForecast: 'Light rain expected',
          location: typeof locationInput === 'string' ? locationInput : 'Your Location'
        },
        soil: {
          type: 'Black Soil',
          nitrogen: 'Medium',
          moisture: 'Moderate'
        }
      }
    };
  }
};
