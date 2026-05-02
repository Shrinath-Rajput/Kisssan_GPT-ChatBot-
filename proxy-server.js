/**
 * Reverse Proxy Server for Railway Deployment
 * Routes API calls to backend (port 8080)
 * Serves frontend (dist folder)
 * Runs on port 3000
 */

import express from 'express';
import { createProxyMiddleware } from 'express-http-proxy';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 8080;
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';

// Log configuration
console.log(`🚀 Starting Reverse Proxy Server`);
console.log(`📍 Frontend Port: ${PORT}`);
console.log(`🔗 Backend: ${BACKEND_HOST}:${BACKEND_PORT}`);

// Proxy /api/* requests to backend
app.use('/api', createProxyMiddleware({
  target: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^': '/api', // Add /api prefix back since express stripped it
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    res.status(503).json({
      error: 'Backend service unavailable',
      message: 'Could not connect to backend server'
    });
  }
}));

// Direct health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Proxy server is running ✅' });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1h',
  etag: false
}));

// Handle client-side routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server listening on port ${PORT}`);
  console.log(`📡 Frontend: http://0.0.0.0:${PORT}`);
  console.log(`🔀 API requests will be proxied to ${BACKEND_HOST}:${BACKEND_PORT}`);
});

export default app;
