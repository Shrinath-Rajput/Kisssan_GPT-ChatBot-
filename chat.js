import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    // 🔒 Basic validation
    if (!message) {
      return res.json({
        success: false,
        reply: "Message is required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // ❌ API key missing
    if (!apiKey) {
      console.error("❌ GEMINI_API_KEY missing");
      return res.json({
        success: false,
        reply: "API key not configured"
      });
    }

    // 🔥 Gemini API call
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

    // ❌ API error handling
    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Gemini API ERROR:", errText);

      return res.json({
        success: false,
        reply: "Gemini API failed"
      });
    }

    const data = await response.json();

    console.log("🔥 GEMINI RESPONSE:", JSON.stringify(data, null, 2));

    // ✅ Safe response extract
    let reply = "No response from AI";

    if (
      data?.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0]?.content?.parts?.length > 0
    ) {
      reply = data.candidates[0].content.parts[0].text;
    }

    return res.json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("❌ CHAT ERROR:", error);

    return res.json({
      success: false,
      reply: "Server error"
    });
  }
});

export default router;