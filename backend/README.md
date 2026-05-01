# 🌾 Kissan GPT Backend

Backend proxy for Kissan GPT - Crop Advisory Application.

This backend handles all Gemini API interactions securely and provides API endpoints for the frontend to use.

## 📋 Quick Start

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
# Create .env file
cp .env.example .env

# Add your Gemini API key
echo "GEMINI_API_KEY=your_key_here" >> .env
```

### Run Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on: `http://localhost:5000`

## 🌐 API Endpoints

### Health Check
```bash
GET /health
```

### Chat
```bash
POST /api/chat
Content-Type: application/json

{
  "message": "What's wrong with my brinjal plant?",
  "image": "data:image/jpeg;base64,...",  // optional
  "language": "English",                   // optional
  "contextData": {}                        // optional
}
```

### Analyze Crop
```bash
POST /api/analyze
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,...",
  "language": "English",
  "contextData": {}
}
```

### Get Location Data
```bash
POST /api/location
Content-Type: application/json

{
  "location": "Nashik, Maharashtra"
  // or
  "location": { "lat": 19.9975, "long": 73.7898 }
}
```

## 📁 Structure

```
backend/
├── server.js                 # Express server
├── package.json              # Dependencies
├── .env                      # Environment variables (not in git)
├── .env.example             # Template
├── routes/
│   ├── chat.js              # Chat endpoint
│   ├── analyze.js           # Image analysis endpoint
│   └── location.js          # Location data endpoint
├── services/
│   └── geminiService.js     # Gemini API integration
└── utils/
    └── errorHandler.js      # Error handling & retry logic
```

## ⚙️ Environment Variables

```bash
PORT=5000                                              # Server port
NODE_ENV=development                                   # Environment
FRONTEND_URL=http://localhost:3000,http://localhost:5173  # CORS
GEMINI_API_KEY=your_actual_api_key_here              # Required!
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Chat Request
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

### Error Handling
The backend automatically:
- ✅ Retries failed requests (up to 2 times)
- ✅ Handles 429 rate limit errors
- ✅ Validates API key on startup
- ✅ Provides detailed error messages
- ✅ Implements exponential backoff

## 🚀 Deployment

### Railway
1. Connect GitHub repo
2. Set Root Directory: `backend`
3. Add environment variables (same as .env)
4. Deploy!

### Other Platforms
- Render: Same as Railway
- Heroku: Same setup
- Vercel/Netlify: Not suitable (these are frontend-only)

## 🔑 Getting API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Copy the key
4. Add to `.env`: `GEMINI_API_KEY=your_key_here`

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in .env |
| API key error | Verify GEMINI_API_KEY in .env |
| CORS errors | Check FRONTEND_URL in .env |
| Module not found | Run `npm install` |
| Timeout errors | Check Gemini API status |

## 📚 Full Documentation

See `../BACKEND_MIGRATION_GUIDE.md` for complete documentation.

## 📝 Notes

- API key is **never** exposed to frontend
- All API calls include retry logic
- Errors include detailed status codes
- Suitable for production use
- Scalable architecture

---

**Status**: Production Ready ✅
