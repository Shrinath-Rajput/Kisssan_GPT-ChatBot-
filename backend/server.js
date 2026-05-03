import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { geminiRequestQueue } from './utils/requestQueue.js';

dotenv.config();

import chatRoutes from './routes/chat.js';
import analyzeRoutes from './routes/analyze.js';
import locationRoutes from './routes/location.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


// ==================== ✅ FIX 1 (VERY IMPORTANT) ====================
app.set('trust proxy', 1);


// ==================== CORS ====================
app.use(cors({
  origin: true, // allow all (no more mismatch issue)
  credentials: true
}));

console.log('✅ CORS enabled (all origins allowed)');


// ==================== BODY ====================
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// ==================== RATE LIMIT (SAFE) ====================
const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

console.log('✅ Rate limiting configured');


// ==================== ROUTES ====================

app.get('/health', (req, res) => {
  res.json({
    status: 'Backend server is running ✅',
    queue: geminiRequestQueue.getStatus()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Kissan GPT Backend is running',
    version: '1.0.0',
    endpoints: ['/api/chat', '/api/analyze', '/api/location', '/health']
  });
});

app.use('/api/chat', chatRateLimiter, chatRoutes);
app.use('/api/analyze', analyzeRateLimiter, analyzeRoutes);
app.use('/api/location', locationRoutes);


// ==================== ERROR ====================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  if (err.message.includes('429')) {
    return res.status(429).json({
      error: 'Server busy',
      message: 'Gemini API quota exceeded',
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
});


// ==================== START ====================
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n========== KISSAN GPT BACKEND STARTUP ==========');
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`⚙️  Env: ${process.env.NODE_ENV}`);
  console.log('================================================\n');
});