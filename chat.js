import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({
        success: false,
        reply: "Please enter a question"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    let reply = "";

    // ================= GEMINI CALL =================
    try {
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
                parts: [
                  {
                    text: `You are an agriculture expert. Answer clearly and concisely.\n\nUser: ${message}`
                  }
                ]
              }
            ]
          }),
        }
      );

      const data = await response.json();

      console.log("🔥 GEMINI:", JSON.stringify(data));

      if (
        data?.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0]?.content?.parts?.length > 0
      ) {
        reply = data.candidates[0].content.parts[0].text;
      }

    } catch (err) {
      console.log("⚠️ Gemini failed, using fallback");
    }

    // ================= FALLBACK (IMPORTANT) =================
    if (!reply || reply.trim() === "") {
      reply = `Here’s a useful farming tip: Maintain proper irrigation, use balanced fertilizers, and monitor crops regularly. (Your query: "${message}")`;
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