# ⚡ Quick Start - Backend Setup

## 🚀 TL;DR - Get Running in 5 Minutes

### 1. Backend Setup
```bash
cd backend
npm install
# Add your API key to backend/.env
echo "GEMINI_API_KEY=your_key_here" >> .env
npm start
```

Backend will be at: `http://localhost:5000`

### 2. Frontend Setup
```bash
# In root directory
npm run dev
```

Frontend will be at: `http://localhost:3000` or `http://localhost:5173`

### 3. Verify It Works
```bash
# Test backend is running
curl http://localhost:5000/health

# You should see:
# {"status":"Backend server is running ✅"}
```

---

## 📋 Configuration Files

### `backend/.env` (Create this)
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000,http://localhost:5173
GEMINI_API_KEY=AIzaSy... # Get from https://aistudio.google.com/app/apikey
```

### `.env.local` (Frontend root - already updated)
```bash
VITE_API_URL=http://localhost:5000
```

---

## 🌐 Production Deployment (Railway)

### Backend
1. Push code to GitHub
2. Go to railway.app → Create new project
3. Select your GitHub repo
4. Set Root Directory: `backend`
5. Add variables (same as backend/.env)
6. Deploy!

### Frontend
1. Same Railway project
2. Add service from same repo
3. Root Directory: `.` (root)
4. Add `VITE_API_URL=https://your-backend-railway-url.com`
5. Deploy!

---

## 🧪 Test Endpoints

### Chat with Text
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What crops do you support?"}'
```

### Analyze Image
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,..."}'
```

### Get Location Data
```bash
curl -X POST http://localhost:5000/api/location \
  -H "Content-Type: application/json" \
  -d '{"location":"Nashik, Maharashtra"}'
```

---

## 🔑 Getting Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API key"
3. Select your project
4. Copy the key
5. Add to `backend/.env`: `GEMINI_API_KEY=your_key_here`
6. Restart backend

---

## ⚙️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Node.js version (need 18+), run `npm install` |
| "Unable to connect" | Verify backend is running, check `VITE_API_URL` matches |
| "API quota exceeded" | Wait 1-2 hours, check if API key is valid |
| CORS errors | Update `FRONTEND_URL` in `backend/.env` |
| No API key error | Add `GEMINI_API_KEY` to `backend/.env` |

---

## 📚 Full Guide
See `BACKEND_MIGRATION_GUIDE.md` for complete documentation.
