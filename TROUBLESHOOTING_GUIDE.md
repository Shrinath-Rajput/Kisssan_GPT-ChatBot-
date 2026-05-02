# Backend Connection Troubleshooting Checklist

## Quick Diagnosis

When you see "Cannot connect to backend server", use this checklist to find the issue:

### ✅ Step 1: Verify Services Are Running
```bash
# Check if both services show "up" status in Railway dashboard:
- Frontend service (kissan-gpt-chatbot-production) → Status should be ✅ UP
- Backend service (kissan-gpt-backend) → Status should be ✅ UP
```

### ✅ Step 2: Test Backend Health
Visit this URL in your browser:
```
https://your-backend-url.up.railway.app/health
```
**Expected response:**
```json
{ "status": "Backend server is running ✅" }
```

**If you get an error:**
- Backend service is down → Restart it from Railway dashboard
- Backend URL is wrong → Check your VITE_API_URL value

### ✅ Step 3: Check VITE_API_URL Variable
In Railway Frontend service **Variables** tab:
- ✅ VITE_API_URL should be set to your backend URL
- ✅ Format should be: `https://backend-xxxxx.up.railway.app`
- ❌ Should NOT include `/api` at the end
- ❌ Should NOT be empty or missing

### ✅ Step 4: Check GEMINI_API_KEY
In Railway Backend service **Variables** tab:
- ✅ GEMINI_API_KEY should be set to a valid Google Generative AI key
- ❌ Should NOT be empty
- ❌ Should NOT say "your-api-key-here"

### ✅ Step 5: Check Browser Console
Open browser Developer Tools (F12) and go to **Console** tab:
- Look for log messages starting with ✅, 🔧, or ❌
- Check for any fetch errors or network issues
- Look for the actual Backend URL being used

## Common Issues & Solutions

### Issue 1: "Cannot connect to backend server"

**Most Common Cause:** VITE_API_URL is not set

**Solution:**
1. Go to Frontend service in Railway
2. Click **Variables** tab
3. Add/Update: `VITE_API_URL=https://your-backend-url.up.railway.app`
4. Save and wait 2-3 minutes for redeploy

### Issue 2: "UNAUTHENTICATED" error with API key

**Cause:** GEMINI_API_KEY is not configured on backend

**Solution:**
1. Go to Backend service in Railway
2. Click **Variables** tab
3. Add/Update: `GEMINI_API_KEY=your-actual-key`
4. Save and wait for backend to restart

### Issue 3: Backend returns 502 or 503

**Cause:** Backend service crashed or not starting

**Solution:**
1. Check Backend service **Logs** tab for errors
2. Common reasons:
   - Missing GEMINI_API_KEY
   - Node version incompatibility
   - Memory issues
3. Try restarting the service from Railway dashboard

### Issue 4: CORS error in browser console

**Cause:** Frontend and Backend origins don't match

**Solution:**
The backend CORS is now configured to allow all origins for development. If you still see CORS errors:
1. Check browser console for exact error message
2. Go to Backend service
3. Ensure Variables are set correctly
4. Restart the backend service

## Advanced Debugging

### Check Frontend Logs
1. Go to Frontend service in Railway
2. Click **Logs** tab
3. Look for lines containing:
   - "Using VITE_API_URL" - shows what URL is being used
   - "Proxy error" - shows if proxy can't reach backend
   - "Backend service unavailable" - clear connectivity issue

### Check Backend Logs
1. Go to Backend service in Railway
2. Click **Logs** tab
3. Look for:
   - "GEMINI_API_KEY is configured" ✅ or "NOT configured" ❌
   - "Server starting on port" - should be 8080
   - "Running on Railway" - confirms deployment
   - Error messages from API calls

### Manual Connection Test
From browser console, try:
```javascript
// Test if proxy is working
fetch('/health').then(r => r.json()).then(d => console.log('✅ Proxy works:', d));

// Test if backend is reachable
fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image: 'test', language: 'English', contextData: {} })
}).then(r => r.json()).then(d => console.log('Backend response:', d));
```

## Environment Variables Reference

### Frontend Service
Must have:
```
VITE_API_URL = https://your-backend-url.up.railway.app
PORT = 3000
```

### Backend Service
Must have:
```
GEMINI_API_KEY = your-actual-api-key
PORT = 8080
```

Optional:
```
FRONTEND_URL = https://your-frontend-url.up.railway.app
```

## Still Not Working?

1. **Take a screenshot** of your Railway dashboard showing:
   - Both service statuses
   - Frontend variables
   - Backend variables
   - Recent logs from both services

2. **Check these files** in your project:
   - `/Dockerfile` - should have VITE_API_URL ARG
   - `/proxy-server.js` - should log backend URL on startup
   - `/backend/server.js` - should log environment config on startup

3. **Common Mistake:** After changing variables in Railway, you MUST wait 2-3 minutes for redeploy. Don't immediately assume it's broken.

4. **Nuclear Option:** Delete both services and redeploy from scratch, making sure to set environment variables BEFORE deploying.
