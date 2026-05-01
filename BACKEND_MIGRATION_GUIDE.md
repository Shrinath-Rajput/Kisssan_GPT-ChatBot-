# 🚀 Kissan GPT Backend Refactoring - Complete Migration Guide

## 📋 Overview

This document outlines the complete refactoring of Kissan GPT from direct Gemini API calls to a secure backend proxy architecture.

### What Changed?

#### Before (❌ Direct API Calls)
```
Frontend (React) → Gemini API (429 errors, quota issues)
```

#### After (✅ Backend Proxy)
```
Frontend (React) → Backend (Express/Node) → Gemini API
```

**Benefits:**
- ✅ Prevents 429 rate limit errors
- ✅ Secure API key management (backend only)
- ✅ Easier error handling and retries
- ✅ Better scalability
- ✅ No direct exposure of API keys to frontend

---

## 📁 New Project Structure

```
crop-advisory-app/
├── backend/                      # 🆕 NEW Backend
│   ├── server.js                 # Express server entry point
│   ├── package.json              # Backend dependencies
│   ├── .env                       # Backend env vars (GEMINI_API_KEY)
│   ├── .env.example              # Template for env vars
│   ├── routes/
│   │   ├── chat.js               # POST /api/chat
│   │   ├── analyze.js            # POST /api/analyze
│   │   └── location.js           # POST /api/location
│   ├── services/
│   │   └── geminiService.js      # Gemini API integration
│   └── utils/
│       └── errorHandler.js       # Error handling & retry logic
│
├── src/
│   ├── pages/                    # Frontend pages (unchanged)
│   ├── components/               # Frontend components (unchanged)
│   └── context/                  # App context (unchanged)
│
├── services/
│   ├── geminiService.ts          # ✅ UPDATED - Now calls backend
│   └── apiClient.ts              # 🆕 NEW - Frontend API client
│
├── vite.config.ts                # Frontend config (unchanged)
├── package.json                  # Frontend deps (unchanged)
├── .env.example                  # ✅ UPDATED - VITE_API_URL
├── .env.local                    # ✅ UPDATED - VITE_API_URL
└── .gitignore                    # Add backend/.env
```

---

## 🔧 Installation & Setup

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` - Web framework
- `cors` - Cross-Origin Resource Sharing
- `dotenv` - Environment variable loader
- `@google/genai` - Gemini SDK

### Step 2: Configure Backend Environment Variables

```bash
# In backend/.env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000,http://localhost:5173
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**⚠️ IMPORTANT**: Get API key from https://aistudio.google.com/app/apikey

### Step 3: Configure Frontend Environment Variables

```bash
# In .env.local (frontend root)
VITE_API_URL=http://localhost:5000
```

### Step 4: Remove Old Environment Variable from Frontend

The frontend **NO LONGER** needs `VITE_GEMINI_API_KEY`. 

- ❌ Delete `VITE_GEMINI_API_KEY` from `.env.local`
- ❌ Delete `VITE_GEMINI_API_KEY` from `.env`
- ✅ API key now lives in `backend/.env` only

### Step 5: Update .gitignore

Ensure backend/.env is ignored:

```bash
# Add to .gitignore
backend/.env
backend/node_modules/
```

---

## 🏃 Running the App

### Development Mode (Both Services)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
# or with auto-reload:
npm run dev
```

Output:
```
🚀 Backend server running on http://localhost:5000
📡 CORS enabled for: http://localhost:3000,http://localhost:5173
```

**Terminal 2 - Start Frontend:**
```bash
# From root directory
npm run dev
```

Output:
```
  VITE v6.2.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Test Backend Health

```bash
curl http://localhost:5000/health
# Response: { "status": "Backend server is running ✅" }
```

### Test Chat API

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What diseases affect Brinjal?",
    "language": "English",
    "contextData": {}
  }'
```

---

## 🌐 API Endpoints

### 1. Chat Endpoint

**POST** `/api/chat`

Request:
```json
{
  "message": "Is my brinjal plant healthy?",
  "image": "data:image/jpeg;base64,...",  // Optional
  "language": "English",                   // Optional
  "contextData": {                         // Optional
    "weather": { "temp": 28, "condition": "Sunny" },
    "soil": { "type": "Black Soil" }
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "message": "Your Brinjal plant appears healthy..."
  },
  "error": null,
  "timestamp": "2026-05-01T10:30:00Z"
}
```

### 2. Analyze Endpoint

**POST** `/api/analyze`

Request:
```json
{
  "image": "data:image/jpeg;base64,...",
  "language": "English",
  "contextData": {}
}
```

Response:
```json
{
  "success": true,
  "data": {
    "analysis": {
      "crop": "Brinjal",
      "diseaseName": "Early Blight",
      "confidence": 0.85,
      "symptoms": ["Brown spots on leaves", "Yellow halo"],
      "treatmentPlan": {
        "immediate": ["Remove affected leaves"],
        "organic": ["Neem oil spray"],
        "chemical": ["Mancozeb fungicide"]
      }
    }
  }
}
```

### 3. Location Endpoint

**POST** `/api/location`

Request:
```json
{
  "location": "Nashik, Maharashtra"
  // OR
  "location": { "lat": 19.9975, "long": 73.7898 }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "weather": {
      "temp": 28,
      "condition": "Partly Cloudy",
      "rainForecast": "Light rain",
      "location": "Nashik, Maharashtra"
    },
    "soil": {
      "type": "Black Soil",
      "nitrogen": "Medium",
      "moisture": "Moderate"
    }
  }
}
```

---

## 🚀 Production Deployment

### Railway Deployment (Recommended)

#### Backend Deployment

1. **Connect Railway to GitHub**
   - Go to https://railway.app/
   - Click "Start a New Project"
   - Select "Deploy from GitHub"
   - Authorize and select your repository

2. **Create Backend Service**
   - Click "Add Service" → "GitHub Repo"
   - Select your crop-advisory-app repo
   - Railway will auto-detect Node.js project

3. **Configure Environment Variables**
   - Go to Railway Service Settings
   - Add variables:
     ```
     PORT=5000
     NODE_ENV=production
     GEMINI_API_KEY=your_actual_api_key
     FRONTEND_URL=https://your-frontend-domain.com
     ```

4. **Set Startup Command**
   - Root Directory: `backend`
   - Start Command: `npm start`

5. **Deploy**
   - Railway auto-deploys on push to main

#### Frontend Deployment

1. **Create Frontend Service (same repo)**
   - Add another service from the same GitHub repo
   - Root Directory: `.` (root)
   - Build Command: `npm run build`
   - Start Command: `npm run preview`

2. **Configure Environment Variables**
   ```
   VITE_API_URL=https://your-backend-domain.railway.app
   ```

3. **Deploy**

### Vercel/Netlify Deployment (Alternative)

**Frontend only (Vercel/Netlify):**
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://your-backend-api.com`

**Backend (Render/Heroku/Railway):**
- Follow same steps as Railway

---

## 🔍 Error Handling

### 429 Rate Limit Error

**Before:**
```
❌ 429 RESOURCE_EXHAUSTED - Cannot query API
```

**After:**
```
⚠️ Server busy - API quota exceeded. Please try again later.
(Automatic retry with exponential backoff)
```

The frontend automatically retries with exponential backoff:
- Attempt 1: Wait 1 second
- Attempt 2: Wait 2 seconds
- Attempt 3: Fails with user message

### Backend API Key Error

If backend doesn't have API key configured:

```json
{
  "success": false,
  "error": {
    "code": "API_KEY_MISSING",
    "message": "Backend API key is not configured"
  }
}
```

**Fix:**
```bash
# Add to backend/.env
GEMINI_API_KEY=your_key_here

# Restart backend
npm start
```

### Network/Connection Errors

Frontend automatically detects and retries:
```javascript
// Automatic retry logic in apiClient.ts
retryFetch(fn, { maxRetries: 2, delayMs: 1000 })
```

---

## 📝 Frontend Code Changes

### Old Code (Direct API)
```typescript
import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

// Direct Gemini call (exposed API key, 429 errors)
const response = await ai.models.generateContent({...});
```

### New Code (Backend Proxy)
```typescript
import { sendChatToBackend } from "../../services/apiClient";

// Call backend proxy (secure, with retry logic)
const response = await sendChatToBackend(
  message,
  image,
  language,
  contextData
);
```

---

## 🧪 Testing Checklist

### Local Testing
- [ ] Backend starts without errors: `npm start` in `/backend`
- [ ] Frontend starts without errors: `npm run dev` in root
- [ ] `/health` endpoint returns 200
- [ ] Chat works with text message
- [ ] Chat works with image + message
- [ ] Image analysis works
- [ ] Location data fetches correctly
- [ ] No API key exposed in browser console
- [ ] 429 error shows retry message

### Railway Testing
- [ ] Backend deployed and running
- [ ] Frontend deployed and running
- [ ] Backend URL configured in frontend env vars
- [ ] Chat feature works on deployed app
- [ ] Image analysis works on deployed app
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### Problem: "Unable to connect" in Chat

**Solution:**
1. Check if backend is running: `curl http://localhost:5000/health`
2. Check frontend env: `VITE_API_URL` should match backend URL
3. Check CORS errors in browser console

### Problem: "API quota exceeded (429)"

**Solution:**
- Backend now handles retries automatically
- If still failing, check `GEMINI_API_KEY` in `backend/.env`
- Wait 1-2 hours for quota to reset

### Problem: "API Key Error" on deployed app

**Solution:**
1. Go to Railway dashboard
2. Select backend service
3. Go to Variables tab
4. Verify `GEMINI_API_KEY` is set
5. Redeploy by pushing to GitHub

### Problem: CORS errors

**Solution:**
1. Update `FRONTEND_URL` in `backend/.env`:
   ```
   FRONTEND_URL=https://your-frontend-domain.com
   ```
2. Restart backend

---

## 📚 Additional Resources

- **Backend Framework:** [Express.js Docs](https://expressjs.com/)
- **Gemini API:** [Google AI SDK](https://ai.google.dev/)
- **Railway Docs:** [Railway Documentation](https://docs.railway.app/)
- **Environment Variables:** [dotenv Docs](https://github.com/motdotla/dotenv)

---

## 🎓 Key Takeaways

| Aspect | Before | After |
|--------|--------|-------|
| API Calls | Frontend → Gemini | Frontend → Backend → Gemini |
| API Key Location | Frontend (.env) | Backend only (.env) |
| Rate Limiting | 429 errors, no retry | Automatic retry with backoff |
| Security | API key exposed to browser | API key hidden in backend |
| Scalability | Limited by quota per user | Shared quota, better distribution |
| Error Handling | Basic error messages | Detailed, user-friendly messages |

---

## ✅ Migration Complete!

Your Kissan GPT app is now production-ready with:
- ✅ Secure backend proxy
- ✅ Automatic error handling and retries
- ✅ 429 rate limit protection
- ✅ Easy deployment to Railway
- ✅ No API key exposure
- ✅ Better user experience

**Next Steps:**
1. Test locally with both services running
2. Deploy backend to Railway
3. Update frontend to point to backend URL
4. Deploy frontend
5. Test all features on production

Happy farming! 🌾
