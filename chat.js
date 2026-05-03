import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;

    console.log("📥 Prompt:", prompt);

    if (!prompt) {
      return res.json({ reply: "❌ Prompt missing" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.json({
        reply: "❌ API key missing",
      });
    }

    // 🔥 DIRECT GEMINI REST CALL (NO SDK)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("🔥 Gemini RAW:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.json({
      reply: text || "⚠️ No AI response",
    });

  } catch (err) {
    console.error("❌ ERROR:", err);

    return res.json({
      reply: "❌ Chat failed",
    });
  }
});

export default router;