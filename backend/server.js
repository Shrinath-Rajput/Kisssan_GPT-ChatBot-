import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { geminiRequestQueue } from "./utils/requestQueue.js";

dotenv.config();

import chatRoutes from "./routes/chat.js";
import analyzeRoutes from "./routes/analyze.js";
import locationRoutes from "./routes/location.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


// ==================== TRUST PROXY ====================
app.set("trust proxy", 1);


// ==================== CORS ====================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

console.log("✅ CORS enabled");


// ==================== BODY ====================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// ==================== RATE LIMIT ====================
const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

console.log("✅ Rate limiting configured");


// ==================== ROUTES ====================

// ✅ HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "Backend running ✅",
    queue: geminiRequestQueue.getStatus(),
  });
});

// ✅ ROOT
app.get("/", (req, res) => {
  res.json({
    message: "Kissan GPT Backend running 🚀",
    endpoints: ["/api/chat", "/api/analyze", "/api/location"],
  });
});

// 🔥 DEBUG LOG (VERY IMPORTANT)
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url}`);
  next();
});

// ✅ API ROUTES
app.use("/api/chat", chatRateLimiter, chatRoutes);
app.use("/api/analyze", analyzeRateLimiter, analyzeRoutes);
app.use("/api/location", locationRoutes);


// ==================== ERROR HANDLING ====================

// 404
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

// GLOBAL ERROR
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  if (err.message?.includes("429")) {
    return res.status(429).json({
      error: "Server busy",
    });
  }

  res.status(500).json({
    error: "Internal server error",
  });
});


// ==================== START ====================
app.listen(PORT, "0.0.0.0", () => {
  console.log("\n========== KISSAN GPT BACKEND ==========");
  console.log(`🚀 Running on port: ${PORT}`);
  console.log(`🌍 Env: ${process.env.NODE_ENV}`);
  console.log("========================================\n");
});