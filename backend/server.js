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

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Backend server is running ✅' });
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

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: ${process.env.FRONTEND_URL || 'default origins'}`);
  console.log(`⚙️  Node environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
