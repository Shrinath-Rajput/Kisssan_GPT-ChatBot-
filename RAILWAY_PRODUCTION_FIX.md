# 🚀 Railway Production Fix - Complete Setup Guide

## ⚠️ Current Issue
The frontend cannot connect to the backend because `VITE_API_URL` is not properly configured or pointing to the wrong backend URL.

---

## ✅ Step-by-Step Fix

### Step 1: Identify Your Services on Railway

1. Go to **railway.app**
2. Click on your project: **earnest-imagination**
3. In the left sidebar, you should see:
   - **radiant-renewal** (Frontend) - running on `https://kissgpt-chatbot-production.up.railway.app`
   - **Kissan_GPT-ChatBot** (Backend) - running on a separate URL
   - **mysql-volume** (Database)

### Step 2: Get Your Backend Service URL

1. Click on the **Kissan_GPT-ChatBot** service (the backend)
2. Look at the "Settings" or "Public Networking" section
3. Copy the public URL (should look like `https://kissgpt-chatbot-production-xxxx.up.railway.app`)
4. **Important:** This URL should be different from the frontend URL

### Step 3: Configure Frontend Environment Variables

1. Go back to the **radiant-renewal** service (Frontend)
2. Click on the **Variables** tab
3. Look for the `VITE_API_URL` variable
4. **Update it** to your backend service URL:
   ```
   VITE_API_URL=https://[your-backend-url].up.railway.app
   ```
5. **Save** and wait **2-3 minutes** for the frontend to redeploy

### Step 4: Configure Backend Environment Variables

Make sure your backend has these variables set:

| Variable | Value | Notes |
|----------|-------|-------|
| `GEMINI_API_KEY` | Your API key | Get from Google AI Studio |
| `NODE_ENV` | `production` | Enables optimizations |
| `PORT` | `8080` | Railway default |
| `FRONTEND_URL` | `https://kissgpt-chatbot-production.up.railway.app` | Your frontend URL |

### Step 5: Verify Health Check

Once configured, visit:
```
https://[your-backend-url].up.railway.app/health
```

You should see:
```json
{
  "status": "Backend server is running ✅"
}
```

---

## 🔍 Troubleshooting

### Issue: Still seeing "Cannot connect to backend server"

**Solution:**
1. Clear browser cache (Ctrl + Shift + Delete)
2. Open DevTools (F12) → Console tab
3. Check if `VITE_API_URL` is being logged
4. Verify the URL is correct and accessible

### Issue: CORS Error

**Solution:**
The backend's CORS is configured to accept requests from:
- Your frontend URL
- `http://localhost:3000` (development)
- `http://localhost:5173` (development)

If you're still getting CORS errors, update `FRONTEND_URL` in the backend to match your actual frontend URL.

### Issue: API Quota (429 Error)

**Solution:**
This means your GEMINI_API_KEY has hit the rate limit. 
- Wait a few minutes
- Or upgrade your Google AI quota
- Check your usage at https://ai.google.dev/billing/overview

---

## 🧪 Test After Configuration

1. **Test Analysis Feature:**
   - Go to "Analyze" page
   - Upload a crop image
   - Should see analysis result

2. **Test Chat Feature:**
   - Go to "Chat" page  
   - Ask about crop diseases
   - Should get responses

3. **Test Weather Feature:**
   - Go to "Weather" page
   - Should see location-based data

---

## 📝 Quick Reference

| Component | Running On | Health Check URL |
|-----------|-----------|------------------|
| Frontend | Railway | `https://kissgpt-chatbot-production.up.railway.app` |
| Backend | Railway | `https://[backend-url].up.railway.app/health` |
| Database | Railway MySQL | Check Railway Dashboard |

---

## 🚀 If Still Not Working

1. **Redeploy both services:**
   - Frontend: Click "Redeploy" in Railway dashboard
   - Backend: Click "Redeploy" in Railway dashboard

2. **Check logs:**
   - Railway Dashboard → Service → Logs
   - Look for any error messages

3. **Restart services:**
   - Stop the service
   - Wait 1 minute
   - Start it again

---

## 💡 For Development

### Local Development:
```bash
# Terminal 1: Backend
cd backend
npm start
# Runs on http://localhost:5000

# Terminal 2: Frontend
npm run dev
# Runs on http://localhost:5173
# Automatically uses http://localhost:5000 as backend
```

### Production on Railway:
- Frontend: Uses `VITE_API_URL` environment variable
- Backend: Runs automatically on port 8080

