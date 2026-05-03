import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("📥 USER:", message);

    if (!message) {
      return res.json({ reply: "❌ Message missing" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.log("❌ API KEY MISSING");
      return res.json({ reply: "❌ API key not set" });
    }

    // 🔥 GEMINI API CALL
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
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("🔥 GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ SAFE EXTRACTION (VERY IMPORTANT)
    let reply = "⚠️ No response from AI";

    if (
      data &&
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return res.json({ reply });

  } catch (error) {
    console.error("❌ CHAT ERROR:", error);

    return res.json({
      reply: "❌ Chat failed (server error)",
    });
  }
});

export default router;