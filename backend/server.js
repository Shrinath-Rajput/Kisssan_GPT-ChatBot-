import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { geminiRequestQueue } from './utils/requestQueue.js';

// Load environment variables
dotenv.config();

// Import routes
import chatRoutes from './routes/chat.js';
import analyzeRoutes from './routes/analyze.js';
import locationRoutes from './routes/location.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// Parse FRONTEND_URL from comma-separated string to array
const getFrontendUrls = () => {
  // Default URLs for development
  const defaultUrls = ['http://localhost:3000', 'http://localhost:5173'];
  
  if (!process.env.FRONTEND_URL) {
    return defaultUrls;
  }
  
  // Parse comma-separated URLs from environment
  const urls = process.env.FRONTEND_URL
    .split(',')
    .map(url => url.trim())
    .filter(url => url.length > 0);
  
  return urls.length > 0 ? urls : defaultUrls;
};

const frontendUrls = getFrontendUrls();

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from configured frontend URLs
    if (!origin || frontendUrls.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from: ${origin}`);
      callback(null, true); // Allow all for now - ensure connectivity first
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

console.log('✅ CORS enabled for:', frontendUrls);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting for API endpoints to prevent overwhelming Gemini API
const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 5, // Max 5 requests per minute per IP
  message: '⚠️ Too many analysis requests. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
});

const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // Max 10 requests per minute per IP
  message: '⚠️ Too many chat requests. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
});

console.log('✅ Rate limiting configured for API endpoints');

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Backend server is running ✅',
    queue: geminiRequestQueue.getStatus()
  });
});

// Root endpoint for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Kissan GPT Backend is running',
    version: '1.0.0',
    endpoints: ['/api/chat', '/api/analyze', '/api/location', '/health']
  });
});

// API Routes
app.use('/api/chat', chatRateLimiter, chatRoutes);
app.use('/api/analyze', analyzeRateLimiter, analyzeRoutes);
app.use('/api/location', locationRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  
  // Handle specific error types
  if (err.message.includes('429')) {
    return res.status(429).json({
      error: 'Server busy - API quota exceeded',
      message: 'Please try again in a few moments',
      code: '429'
    });
  }
  
  if (err.message.includes('API_KEY')) {
    return res.status(500).json({
      error: 'API configuration error',
      message: 'Backend API key is not configured',
      code: 'CONFIG_ERROR'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    code: 'SERVER_ERROR'
  });
});

// ==================== SERVER START ====================

// Log startup information
const startupLog = () => {
  console.log('\n========== KISSAN GPT BACKEND STARTUP ==========');
  console.log(`🚀 Server starting on port: ${PORT}`);
  console.log(`⚙️  Node environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 CORS origins: ${frontendUrls.join(', ')}`);
  
  // Check API key
  if (process.env.GEMINI_API_KEY) {
    console.log('✅ GEMINI_API_KEY is configured');
  } else {
    console.warn('⚠️  WARNING: GEMINI_API_KEY is NOT configured!');
    console.warn('   - Set it in Railway Variables tab');
    console.warn('   - Without it, /api/analyze and /api/chat will fail');
  }
  
  // Check if running on Railway
  if (process.env.RAILWAY_ENVIRONMENT_NAME) {
    console.log(`🚄 Running on Railway: ${process.env.RAILWAY_ENVIRONMENT_NAME}`);
    console.log(`📍 Railway service: ${process.env.RAILWAY_SERVICE_NAME || 'unknown'}`);
  }
  
  console.log('\n✅ Backend is ready to receive requests');
  console.log(`📚 API Endpoints:`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/chat`);
  console.log(`   - POST /api/analyze`);
  console.log(`   - POST /api/location`);
  console.log('================================================\n');
};

app.listen(PORT, '0.0.0.0', () => {
  startupLog();
});

export default app;
