<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌾 Kissan GPT - Crop Advisory App

AI-powered crop advisory system for Indian farmers focusing on **Brinjal** and **Grapes**.

## ⚙️ Architecture

This app now uses a **backend proxy architecture** for security and reliability:

```
Frontend (React/Vite) → Backend (Express/Node) → Gemini API
```

**Key Benefits:**
- ✅ No 429 rate limit errors
- ✅ Secure API key management
- ✅ Automatic retry logic
- ✅ Production-ready deployment
- ✅ Better error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Gemini API key (get from https://aistudio.google.com/app/apikey)

### 1️⃣ Backend Setup

```bash
cd backend
npm install
echo "GEMINI_API_KEY=your_api_key_here" > .env
npm start
```

✅ Backend runs on: `http://localhost:5000`

### 2️⃣ Frontend Setup

```bash
# In root directory
npm install
npm run dev
```

✅ Frontend runs on: `http://localhost:3000` or `http://localhost:5173`

### 3️⃣ Test It

```bash
# In another terminal
curl http://localhost:5000/health
# Expected: {"status":"Backend server is running ✅"}
```

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START_BACKEND.md](./QUICK_START_BACKEND.md) | 5-minute setup guide ⚡ |
| [BACKEND_MIGRATION_GUIDE.md](./BACKEND_MIGRATION_GUIDE.md) | Complete architecture guide 📚 |
| [BACKEND_REFACTORING_SUMMARY.md](./BACKEND_REFACTORING_SUMMARY.md) | Changes summary 📊 |
| [backend/README.md](./backend/README.md) | Backend documentation 🔧 |

## 🌐 API Endpoints

### Chat
```bash
POST /api/chat
```
Send text/image to get crop advice

### Analyze
```bash
POST /api/analyze
```
Analyze crop health from image

### Location
```bash
POST /api/location
```
Get weather/soil data for location

See [BACKEND_MIGRATION_GUIDE.md](./BACKEND_MIGRATION_GUIDE.md#-api-endpoints) for full details.

## 🎯 Features

- 🖼️ **Image Analysis**: Upload crop photos to detect diseases
- 💬 **Chat Interface**: Ask questions about Brinjal & Grapes
- 📍 **Location Data**: Get weather and soil recommendations
- 🌐 **Multi-language**: English, Hindi, Marathi support
- 📱 **Responsive UI**: Works on desktop and mobile
- ♻️ **Retry Logic**: Automatic retries for failed requests

## 🏗️ Project Structure

```
crop-advisory-app/
├── backend/                      # Backend proxy (NEW)
│   ├── server.js
│   ├── routes/                   # API endpoints
│   ├── services/                 # Gemini integration
│   ├── utils/                    # Error handling
│   ├── package.json
│   └── .env (create this)
│
├── src/
│   ├── pages/                    # React pages
│   ├── components/               # React components
│   ├── context/                  # App state
│   └── hooks/                    # Custom hooks
│
├── services/
│   ├── apiClient.ts             # Backend API client (NEW)
│   └── geminiService.ts         # Updated to use backend
│
├── vite.config.ts               # Frontend config
├── package.json                 # Frontend dependencies
├── .env.local                   # Frontend env vars
└── tsconfig.json
```

## 🔧 Configuration

### Backend (.env)
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000,http://localhost:5173
GEMINI_API_KEY=your_key_here
```

### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Railway (Recommended)

**See full guide in** [BACKEND_MIGRATION_GUIDE.md](./BACKEND_MIGRATION_GUIDE.md#-production-deployment)

Quick steps:
1. Push to GitHub
2. Create Railway project
3. Deploy both backend & frontend
4. Configure environment variables
5. Done! ✅

## 🧪 Testing

```bash
# Test backend health
curl http://localhost:5000/health

# Test chat
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'

# Test image analysis
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Run `npm install` in backend, check Node version |
| "Unable to connect" | Make sure backend is running on 5000 |
| "API quota exceeded" | Check API key is valid, wait for quota reset |
| CORS errors | Verify FRONTEND_URL in backend/.env |

**See [BACKEND_MIGRATION_GUIDE.md](./BACKEND_MIGRATION_GUIDE.md#-troubleshooting) for detailed troubleshooting.**

## 🔐 Security

- ✅ API key only in backend
- ✅ No secrets in frontend code
- ✅ CORS validation
- ✅ Input validation
- ✅ Error message sanitization

## 📊 Tech Stack

**Frontend:**
- React 19
- Vite 6
- TypeScript
- TailwindCSS
- React Router

**Backend:**
- Node.js 18+
- Express 4
- Gemini API
- Dotenv

## 📝 Development

```bash
# Install dependencies (both)
npm install
cd backend && npm install

# Run development
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev

# Build for production
npm run build
```

## 📞 Support

For detailed information:
- Quick setup? → [QUICK_START_BACKEND.md](./QUICK_START_BACKEND.md)
- Full guide? → [BACKEND_MIGRATION_GUIDE.md](./BACKEND_MIGRATION_GUIDE.md)
- Changes? → [BACKEND_REFACTORING_SUMMARY.md](./BACKEND_REFACTORING_SUMMARY.md)

## 📄 License

This project is configured through AI Studio.

---

**Status**: ✅ Production Ready

**Last Updated**: 2026-05-01

**Architecture**: Backend Proxy Pattern

**Version**: 2.0 (Refactored with Backend)
