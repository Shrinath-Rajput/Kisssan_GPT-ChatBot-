# 🚀 Fix Backend Connection - Quick Start

## The Problem
You're seeing "Cannot connect to backend server" error when trying to analyze crops.

## The Solution (5 Minutes)

### 1️⃣ Get Your Backend URL
- Log into [railway.app](https://railway.app)
- Click your **Backend** service  
- Copy the **Public URL** from the top right (looks like `https://kissan-gpt-backend-xyz.up.railway.app`)

### 2️⃣ Add It to Frontend
- Click your **Frontend** service
- Click **Variables** tab
- Paste this new variable:
  ```
  VITE_API_URL=https://kissan-gpt-backend-xyz.up.railway.app
  ```
  (Replace with YOUR actual backend URL from step 1)

### 3️⃣ Set Backend API Key
- Click your **Backend** service
- Click **Variables** tab
- Add/Update this:
  ```
  GEMINI_API_KEY=your-actual-gemini-api-key-here
  ```

### 4️⃣ Wait & Test
- Wait 2-3 minutes for Railway to redeploy
- Refresh the app in your browser
- Try analyzing a crop image
- **Done!** ✅

## Verify It's Working

### Check Frontend Logs
```
Click Frontend Service → Logs tab
Look for: "Using VITE_API_URL from environment"
```

### Check Backend Logs
```
Click Backend Service → Logs tab
Look for: "GEMINI_API_KEY is configured" ✅
Look for: "Backend is ready to receive requests" ✅
```

### Quick Health Check
Visit these in your browser:
- `https://your-frontend.up.railway.app/health` → Should show green checkmark
- `https://your-backend.up.railway.app/health` → Should return JSON response

## If It Still Doesn't Work

See [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md) for detailed diagnosis steps.

## Common Mistakes to Avoid

❌ **Wrong:** `https://kissan-gpt-backend-xyz.up.railway.app/api` (includes /api)
✅ **Right:** `https://kissan-gpt-backend-xyz.up.railway.app`

❌ **Wrong:** Setting VITE_API_URL to `localhost:8080` (doesn't work on Railway)
✅ **Right:** Using the full Railway public domain

❌ **Wrong:** Not waiting for redeploy to complete
✅ **Right:** Wait 2-3 minutes and check the checkmark status

## What Was Changed

### Backend (`backend/server.js`)
- ✅ Improved CORS configuration for Railway domains
- ✅ Better error handling and logging

### Frontend (`Dockerfile`)
- ✅ Added ARG for VITE_API_URL during build
- ✅ Properly passes environment variables to proxy server

### Proxy Server (`proxy-server.js`)
- ✅ Fixed logging bug
- ✅ Properly detects backend URL from environment

### API Client (`services/apiClient.ts`)
- ✅ Smart backend URL detection for all environments
- ✅ Clear error messages with setup instructions

## Next Steps (Optional)

After confirming it works:
1. Bookmark the [Railway Dashboard](https://railway.app)
2. Save your backend URL somewhere secure
3. Consider setting up monitoring for the services
4. Check logs regularly for any API key quota issues

---

**Questions?** Check the detailed guides:
- [RAILWAY_SETUP_FINAL.md](./RAILWAY_SETUP_FINAL.md) - Comprehensive setup guide
- [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md) - Detailed troubleshooting
