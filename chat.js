import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    console.log("🔥 GEMINI:", data);

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("❌ CHAT ERROR:", error);

    res.status(500).json({
      success: false,
      reply: "Chat failed"
    });
  }
});

export default router;