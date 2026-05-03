import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ================= CHAT =================
router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        reply: "❌ Prompt missing",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent(prompt);

    const text =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    console.log("✅ Gemini Reply:", text);

    res.json({
      reply: text,
    });

  } catch (error) {
    console.error("❌ Chat Error:", error);

    res.status(500).json({
      reply: "❌ AI failed",
    });
  }
});

export default router;