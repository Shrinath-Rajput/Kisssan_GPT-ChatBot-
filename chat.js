import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Message missing" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // ✅ UPDATED MODEL (IMPORTANT)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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

    console.log("🔥 GEMINI FULL:", JSON.stringify(data, null, 2));

    // ✅ SAFE PARSING
    let reply = "No response from AI";

    if (data?.candidates?.length > 0) {
      reply =
        data.candidates[0]?.content?.parts?.[0]?.text ||
        "No response text";
    }

    res.json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("❌ CHAT ERROR:", error);

    res.json({
      success: false,
      reply: "Server error",
    });
  }
});

export default router;