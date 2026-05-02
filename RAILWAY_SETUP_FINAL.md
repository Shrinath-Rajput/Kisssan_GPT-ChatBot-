# Railway Deployment - Complete Setup Guide

## Current Issue
Frontend cannot connect to backend server on Railway (shows "Cannot connect to backend server" error)

## Root Cause
The frontend service doesn't know the backend service URL, so the proxy server can't forward requests to the backend.

## Solution: Step-by-Step Configuration

### Step 1: Deploy Both Services
Ensure both services are deployed on Railway:
- **Frontend** (kissan-gpt-chatbot-production or similar)
- **Backend** (kissan-gpt-backend or similar)

### Step 2: Get Backend Service Public Domain
1. Go to [railway.app](https://railway.app)
2. Click on your **Backend** service
3. Go to **Settings** tab
4. Copy the **Public URL** (looks like: `https://backend-xxxxx.up.railway.app`)
5. Save this - you'll need it in the next step

### Step 3: Configure Frontend Service Environment Variables
1. Go back to your **Frontend** service in Railway
2. Click on the **Variables** tab
3. Add this new variable:
   ```
   VITE_API_URL = https://backend-xxxxx.up.railway.app
   ```
   (Replace `xxxxx` with your actual backend service URL)

4. **DO NOT include `/api`** - the proxy server adds it automatically
5. Example valid values:
   - ✅ `https://kissan-gpt-backend.up.railway.app`
   - ✅ `https://my-backend-abc123.up.railway.app`
   - ❌ `https://kissan-gpt-backend.up.railway.app/api` (wrong - includes /api)

### Step 4: Configure Backend Service Environment Variables
1. Go to your **Backend** service
2. Click on the **Variables** tab
3. Add/Update these variables:
   ```
   GEMINI_API_KEY = your-actual-gemini-api-key
   FRONTEND_URL = https://frontend-domain.up.railway.app
   PORT = 8080
   ```

### Step 5: Wait for Deployment
1. After adding variables, Railway will automatically redeploy
2. **Wait 2-3 minutes** for the deployment to complete
3. You'll see a checkmark when it's done

### Step 6: Test the Connection
1. Go to your frontend URL in a browser
2. Try to analyze a crop image
3. If successful, you should see the analysis result
4. If still failing, check the **logs** in both services for errors

## How It Works

```
Frontend (3000)
    ↓
Proxy Server (same container, routes /api/*)
    ↓
Backend Service (VITE_API_URL environment variable)
    ↓
Gemini API
```

## Troubleshooting

### Issue: Still Showing "Cannot connect to backend server"
**Check**:
1. Is Backend service running? (Check Railway dashboard - should show "up")
2. Is VITE_API_URL correct? (Check Frontend Variables)
3. Are you using the full URL with `https://`?
4. Did you wait 2-3 minutes after making changes?

**To debug**:
1. Click on your **Backend** service
2. Go to **Logs** tab
3. Look for error messages about API key or connection issues

### Issue: "UNAUTHENTICATED" or "API key not configured"
**Solution**:
1. Go to Backend service Variables
2. Ensure `GEMINI_API_KEY` is set with your actual API key
3. Restart the service or trigger a redeploy

### Issue: Backend returns 502 or 503 error
**Solution**:
1. Check Backend service logs for errors
2. Ensure GEMINI_API_KEY is valid
3. Try restarting the Backend service from Railway dashboard

## Environment Variables Summary

### Frontend Service
```
PORT=3000
VITE_API_URL=https://your-backend-url.up.railway.app
BACKEND_HOST=localhost (used only for local development)
BACKEND_PORT=8080 (used only for local development)
```

### Backend Service
```
PORT=8080
GEMINI_API_KEY=your-api-key-here
FRONTEND_URL=https://your-frontend-url.up.railway.app
```

## Local Development

To test locally before deploying:

### Terminal 1 - Backend:
```bash
cd backend
npm install
GEMINI_API_KEY=your-key npm start
```

### Terminal 2 - Frontend & Proxy:
```bash
npm install
npm start
```

Then visit `http://localhost:3000`

## Files Modified for Railway Support
- `Dockerfile` - Added ARG for VITE_API_URL during build
- `proxy-server.js` - Routes /api/* to backend using VITE_API_URL
- `backend/server.js` - Improved CORS configuration
- `services/apiClient.ts` - Smart backend URL detection

## Still Having Issues?

1. **Check logs** in Railway dashboard for both services
2. **Verify backend is running** - visit `https://your-backend.up.railway.app/health`
3. **Test frontend health** - visit `https://your-frontend.up.railway.app/health`
4. **Review environment variables** - ensure no typos or missing values
