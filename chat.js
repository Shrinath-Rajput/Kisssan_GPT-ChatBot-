import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message required"
      });
    }

    // 🔥 TEMP STATIC RESPONSE (TEST FIRST)
    return res.json({
      success: true,
      reply: `You asked: ${message}. This is working! ✅`
    });

  } catch (error) {
    console.error("❌ CHAT ERROR:", error);

    return res.status(500).json({
      success: false,
      reply: "Server error"
    });
  }
});

export default router;