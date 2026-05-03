import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("📥 Prompt:", prompt);

    if (!prompt) {
      return res.json({ reply: "❌ Prompt missing" });
    }

    // 🔥 SAFE FALLBACK (जर API key issue असेल)
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        reply: "⚠️ Gemini API key not set. Showing demo response.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);

    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("🤖 Gemini:", text);

    return res.json({
      reply:
        text ||
        "⚠️ AI did not return response. Try again.",
    });

  } catch (err) {
    console.error("❌ ERROR:", err);

    return res.json({
      reply: "❌ Chat service error",
    });
  }
});

export default router;