import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
const frontendUrls = (process.env.FRONTEND_URL || 'http://localhost:3000,http://localhost:5173')
  .split(',')
  .map(url => url.trim());

// CORS configuration
app.use(cors({
  origin: frontendUrls,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

console.log('✅ CORS enabled for:', frontendUrls);

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend server is running ✅' });
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
app.use('/api/chat', chatRoutes);
app.use('/api/analyze', analyzeRoutes);
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
