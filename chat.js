import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({
        success: false,
        reply: "Please enter a message"
      });
    }

    let reply = "";

    const text = message.toLowerCase();

    // ✅ SIMPLE WORKING LOGIC (ALWAYS RESPONSE)
    if (text.includes("grapes")) {
      reply = "Grapes are small round fruits that grow in clusters on vines. They are used for eating, juice, and wine.";
    } 
    else if (text.includes("brinjal") || text.includes("eggplant")) {
      reply = "Brinjal (eggplant) is a vegetable crop. It requires warm climate and regular watering.";
    } 
    else if (text.includes("disease")) {
      reply = "Crop diseases are caused by fungi, bacteria, or viruses. Regular monitoring helps prevent damage.";
    } 
    else {
      reply = `You said: "${message}". Farming tip: Maintain proper irrigation and soil health.`;
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