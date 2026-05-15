import { GoogleGenerativeAI } from '@google/generative-ai';
import { geminiRequestQueue } from '../utils/requestQueue.js';
import { cacheManager } from '../utils/cache.js';
import { getFallbackAnalysisResponse, getFallbackChatResponse } from '../utils/fallbackResponses.js';

const SYSTEM_INSTRUCTION_BASE = `
You are Kissan GPT, a farming expert for Brinjal and Grapes in India.

CRITICAL RULES:
1. Answer EXACTLY what the user asks - be specific and direct
2. If user asks "what is grapes" - describe grapes (not general farming tips)
3. If user asks "what is brinjal" - describe brinjal (not general farming tips)
4. If user asks "disease of grapes" - list and describe grape diseases ONLY
5. Every answer must be UNIQUE and DIFFERENT from previous answers
6. Generate FRESH content every time - do NOT repeat
7. Be detailed, practical, and farmer-friendly
8. If question is NOT about Brinjal or Grapes, politely redirect to your area of expertise
9. QUALITY OVER QUANTITY - Better to give one accurate answer than three vague ones
10. Always provide actionable, tested farming advice

EXAMPLES:
Q: "what is grapes"
A: "Grapes (Vitis spp.) are perennial fruit-bearing vines that grow for 50+ years. They produce clusters of berries used for fresh consumption, juice, wine, and raisins..."

Q: "what is brinjal"
A: "Brinjal, scientifically known as Solanum melongena, is a warm-season vegetable from the Solanaceae family. It's commonly called Eggplant in English..."

Q: "disease of grapes"
A: "Grapes are susceptible to several fungal diseases: 1) Powdery Mildew - white powder coating on leaves, 2) Black Rot - circular spots with concentric rings, 3) Downy Mildew - yellow patches..."

KEY: ANSWER THE QUESTION ASKED - not general farming advice unless asked.
`;

const getLanguageInstruction = (language) => {
  const languageInstructions = {
    'Marathi': `
LANGUAGE INSTRUCTION: YOU MUST RESPOND ENTIRELY IN MARATHI.
- All text must be in Devanagari script (मराठी)
- Use simple, farm-friendly Marathi language
- Include practical farming terminology in Marathi
- Example: वांगी = Brinjal, द्राक्ष = Grapes, पत्र्याचे डाग = Leaf Spot, फंजिसाइड = Fungicide
- IMPORTANT: Do not mix languages - respond ONLY in Marathi
    `,
    'Hindi': `
LANGUAGE INSTRUCTION: YOU MUST RESPOND ENTIRELY IN HINDI.
- All text must be in Devanagari script (हिंदी)
- Use simple, farm-friendly Hindi language
- Include practical farming terminology in Hindi
- Example: बैंगन = Brinjal, अंगूर = Grapes, पत्ती धब्बा = Leaf Spot, कवकनाशी = Fungicide
- IMPORTANT: Do not mix languages - respond ONLY in Hindi
    `,
    'English': `
LANGUAGE INSTRUCTION: Respond in clear, simple English.
- Use English with practical farming terminology
- Keep language simple and farmer-friendly
- Make sure any technical terms are explained
    `
  };

  return languageInstructions[language] || languageInstructions['English'];
};

const getSystemInstruction = (language, contextData) => {
  const contextString = `
Location: ${contextData?.weather?.location || 'Unknown'}
Weather: ${contextData?.weather?.condition || 'N/A'} - ${contextData?.weather?.temp || 'N/A'}°C
`;
  
  const languageInstruction = getLanguageInstruction(language);

  return `${SYSTEM_INSTRUCTION_BASE}\n${contextString}\n${languageInstruction}`;
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
    // ⚠️ NO CACHING for chat - users expect fresh responses every time
    // Caching is disabled to ensure each question gets a unique answer

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

    const response = await geminiRequestQueue.execute(async () => {
      // Use consistent temperature for more reliable answers
      const consistentTemp = 0.7;
      
      return await Promise.race([
        model.generateContent({
          contents: [{ role: 'user', parts: parts }],
          generationConfig: {
            temperature: consistentTemp,
            maxOutputTokens: 1024,
            topP: 0.95,
            topK: 50,
          },
          systemInstruction: systemInstruction,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout after 30s')), 30000))
      ]);
    });

    // Extract text from response - handle both response.text and response.candidates structure
    let responseText = null;
    if (typeof response.text === 'function') {
      responseText = response.text();
    } else if (response.text) {
      responseText = response.text;
    } else if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
      responseText = response.candidates[0].content.parts[0].text;
    }

    const result = {
      success: true,
      message: responseText || 'I could not generate a response.',
      language: language || 'English'
    };

    console.log(`✅ Chat message processed successfully in ${language || 'English'}`);
    return result;
  } catch (error) {
    console.error('❌ Chat Service Error:', error.message || error);
    
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ GEMINI_API_KEY is not configured - Using smart fallback response');
    }
    
    // If API fails, generate smart fallback response
    if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
      console.warn('⚠️ API quota exceeded - Using fallback');
      const fallback = getFallbackChatResponse(prompt, language);
      return {
        success: true,
        message: fallback,
        language: language || 'English',
        fallback: true
      };
    }
    
    if (error.message.includes('API_KEY') || error.message.includes('not configured') || !process.env.GEMINI_API_KEY) {
      const fallback = getFallbackChatResponse(prompt, language);
      return {
        success: true,
        message: fallback,
        language: language || 'English',
        fallback: true
      };
    }
    
    // For any other error, provide helpful fallback
    const fallback = getFallbackChatResponse(prompt, language);
    return {
      success: true,
      message: fallback,
      language: language || 'English',
      fallback: true
    };
  }
};

// Analysis Service
export const analyzeCropHealthService = async (imageBase64, language, contextData) => {
  try {
    // Check cache first - use first 100 chars of image as key
    const cacheKey = { type: 'analysis', imageHash: imageBase64.substring(0, 100), language };
    const cached = cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

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

    const response = await geminiRequestQueue.execute(async () => {
      return await Promise.race([
        model.generateContent({
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
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout after 30s')), 30000))
      ]);
    });

    // Extract text from response - handle both response.text and response.candidates structure
    let responseText = null;
    if (typeof response.text === 'function') {
      responseText = response.text();
    } else if (response.text) {
      responseText = response.text;
    } else if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
      responseText = response.candidates[0].content.parts[0].text;
    }

    const result = {
      success: true,
      analysis: extractJSON(responseText),
      language: language || 'English'
    };

    // Cache the successful response
    cacheManager.set(cacheKey, result);
    console.log(`✅ Crop analysis completed successfully in ${language || 'English'}`);
    return result;
  } catch (error) {
    console.error('❌ Analysis Service Error:', error);
    
    // If it's a quota/rate limit error, use fallback response
    if (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
      console.warn('⚠️ API quota exceeded - Using fallback analysis response');
      const fallback = {
        success: true,
        analysis: getFallbackAnalysisResponse(language),
        language: language || 'English',
        source: 'fallback'
      };
      return fallback;
    }
    
    throw error;
  }
};

// Location Data Service
export const getLocationContextData = async (locationInput) => {
  try {
    const apiKey = validateApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    let locationPrompt = typeof locationInput === 'string' 
      ? `Location: "${locationInput}"` 
      : `Lat: ${locationInput.lat}, Long: ${locationInput.long}`;
    
    const response = await Promise.race([
      model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: `${locationPrompt}
        Find typical weather and soil data for this location:
        1. Location name (Village/City, District)
        2. Typical temperature and weather patterns
        3. General rain forecast pattern
        4. Typical soil type for region

        Return ONLY valid JSON (no markdown):
        {"weather": {"temp": 28, "condition": "Partly Cloudy", "rainForecast": "Light rain expected", "location": "City, District"}, "soil": {"type": "Black Soil", "nitrogen": "Medium", "moisture": "Moderate"}}`
          }]
        }],
        generationConfig: {
          temperature: 0.3
        }
      }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
    ]);

    // Extract text from response
    let responseText = null;
    if (typeof response.text === 'function') {
      responseText = response.text();
    } else if (response.text) {
      responseText = response.text;
    } else if (response.candidates && response.candidates[0]?.content?.parts?.[0]?.text) {
      responseText = response.candidates[0].content.parts[0].text;
    }

    const data = extractJSON(responseText);
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
