import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("📥 USER:", message);

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.json({ reply: "❌ API key missing" });
    }

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

    console.log("🔥 GEMINI:", JSON.stringify(data, null, 2));

    // ✅ SAFE RESPONSE
    let reply = "";

    if (
      data?.candidates?.[0]?.content?.parts?.[0]?.text
    ) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data?.error) {
      console.log("❌ GEMINI ERROR:", data.error);
      reply = "❌ Gemini error: " + data.error.message;
    } else {
      reply = "⚠️ No response from AI";
    }

    res.json({ reply });

  } catch (err) {
    console.error("❌ CHAT ERROR:", err);
    res.json({ reply: "❌ Server error" });
  }
});

export default router;