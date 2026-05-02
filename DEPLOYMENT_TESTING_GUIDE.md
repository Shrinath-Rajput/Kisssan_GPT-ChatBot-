# ✅ Railway Deployment Checklist & Testing Guide

## 🔍 CURRENT STATUS

Based on your Railway setup, here's what we found:

### ✅ What's Working:
- Frontend is deployed on Railway
- Backend infrastructure is set up
- Database is configured
- CORS is enabled

### ❌ What's Broken:
- **Frontend can't reach Backend** (the main issue)
- Error message: "Cannot connect to backend server"

---

## 🚀 QUICK FIX (5 minutes)

### Step 1: Update Frontend Environment Variables

1. Open **railway.app** → Click your project
2. Find **Kissan_GPT-ChatBot** service (Frontend)
3. Click **"Variables"** tab
4. Look for **`VITE_API_URL`** variable
5. **Update it to match your BACKEND service URL:**
   ```
   https://[BACKEND-SERVICE-NAME].up.railway.app
   ```
6. **Save** and wait 2-3 minutes for redeployment

### Step 2: Verify Backend Configuration

1. Click on your **Backend service** in Railway
2. Go to **Variables** tab
3. Ensure these variables are set:

| Variable | Value | Example |
|----------|-------|---------|
| `GEMINI_API_KEY` | Your API key | `AIza...` |
| `FRONTEND_URL` | Your frontend URL | `https://kissgpt-chatbot-production.up.railway.app` |
| `NODE_ENV` | `production` | `production` |

4. **Save** and wait for redeployment

### Step 3: Test Connection

1. After both services redeploy, go to your frontend URL
2. Try uploading an image to the **Analyze** page
3. Should see analysis result (not error)

---

## 🧪 TESTING ALL FEATURES

Once the backend connection is fixed, test all three main features:

### 1. 🖼️ Crop Analysis (Prediction)

**What it does:** Upload an image of a crop (Brinjal/Eggplant or Grapes) and get disease detection

**Steps:**
1. Go to **"Analyze"** page
2. Upload or take a photo of a brinjal/grape plant leaf
3. Should see:
   - Disease detected (if any)
   - Confidence percentage
   - Treatment recommendations
   - Preventive measures

**Expected time:** 5-10 seconds

---

### 2. 💬 Chat with Expert (Chat)

**What it does:** Ask questions about crop care and get expert advice

**Steps:**
1. Go to **"Chat"** page
2. Ask a question like:
   - "What are common brinjal diseases?"
   - "How to treat powdery mildew?"
   - "When should I harvest grapes?"
3. Optional: Upload an image to attach to your question
4. Should get detailed response in your selected language

**Expected time:** 3-5 seconds per response

**Languages supported:** English, Marathi, Hindi

---

### 3. 🌤️ Weather Information (Weather)

**What it does:** Get weather data for your location to help with crop planning

**Steps:**
1. Go to **"Weather"** page
2. Enter your location or use current location
3. Should see:
   - Current temperature
   - Weather condition
   - Rain forecast
   - Soil information
   - Nitrogen levels

**Expected time:** 2-3 seconds

---

## 🔧 TROUBLESHOOTING

### Problem 1: Still seeing "Cannot connect to backend server"

**Check these:**
1. **Is `VITE_API_URL` set correctly?**
   - Go to Frontend Variables in Railway
   - Make sure it's pointing to actual backend service URL
   - NOT localhost, NOT your own frontend URL

2. **Did you save and wait for redeploy?**
   - Click Save in Variables
   - Wait 2-3 minutes
   - Refresh your browser (Ctrl + F5)

3. **Is backend service running?**
   - Go to Backend service in Railway
   - Check the Logs tab
   - Should see "✅ Backend is ready to receive requests"

4. **Is CORS configured?**
   - Check backend `FRONTEND_URL` variable
   - Should match your actual frontend URL exactly

**Solution steps:**
```
1. Clear browser cache (Ctrl + Shift + Delete)
2. Check frontend variables again
3. Manually test backend: https://[backend-url].up.railway.app/health
4. Should see: {"status": "Backend server is running ✅"}
5. If not, restart backend service
```

---

### Problem 2: "Server busy - API quota exceeded" (429 Error)

**Cause:** Your Gemini API key has hit rate limits

**Solutions:**
1. **Wait 1-2 minutes** and try again
2. **Check Google AI usage:**
   - Go to https://ai.google.dev/billing/overview
   - See your current quota
3. **Upgrade your tier:** Get more free quota or upgrade plan
4. **Use rate limiting:**
   - Wait longer between requests
   - Reduce image quality (smaller file size)

---

### Problem 3: "API key not configured" Error

**Cause:** `GEMINI_API_KEY` is missing from backend environment variables

**Fix:**
1. Go to Backend service in Railway
2. Go to Variables tab
3. Add `GEMINI_API_KEY` with your actual API key
4. Get API key from https://ai.google.dev
5. Save and restart backend

---

### Problem 4: Features work but responses are slow

**Possible causes:**
- Slow internet connection
- Gemini API is slow
- Backend service cold start

**Solutions:**
1. Wait 10-15 seconds for first request (cold start)
2. Check your internet speed
3. Try again after 1 minute
4. Check Railway logs for errors

---

## 📱 TESTING CHECKLIST

Print this and check off each item:

```
Backend Connection:
☐ VITE_API_URL is set to backend service URL
☐ FRONTEND_URL on backend matches frontend URL
☐ GEMINI_API_KEY is configured
☐ Both services have finished deploying
☐ Cleared browser cache
☐ /health endpoint returns success

Crop Analysis Feature:
☐ Can navigate to Analyze page
☐ Can upload/capture image
☐ Image displays correctly
☐ Can click "Analyze" button
☐ Gets response within 10 seconds
☐ Response shows disease or "healthy"
☐ Treatment recommendations are shown
☐ Can go back and analyze another image

Chat Feature:
☐ Can navigate to Chat page
☐ Welcome message displays
☐ Can type a message
☐ Can click send
☐ Gets response within 5 seconds
☐ Response is in selected language
☐ Can upload image with message
☐ Chat history is preserved

Weather Feature:
☐ Can navigate to Weather page
☐ Can enter location or use current
☐ Displays weather data
☐ Shows temperature and condition
☐ Shows soil information
☐ Updates correctly for different locations

Language Support:
☐ Can switch to English
☐ Can switch to Marathi
☐ Can switch to Hindi
☐ Responses change language when switched
```

---

## 🐛 DEBUG TIPS

### To see detailed error messages:

1. Open **DevTools** (Press `F12`)
2. Go to **Console** tab
3. Look for messages like:
   - `✅ Using VITE_API_URL from environment: ...`
   - `❌ Connection Error - Backend not reachable at: ...`
   - `🔗 Backend API URL: ...`

### To check backend logs:

1. Go to **Railway Dashboard**
2. Click your **Backend service**
3. Click **Logs** tab
4. Look for startup messages like:
   - `🚀 Server starting on port: ...`
   - `✅ GEMINI_API_KEY is configured`
   - `📡 CORS origins: ...`

### To test backend manually:

Open your browser and visit:
```
https://[your-backend-url].up.railway.app/health
```

Should see:
```json
{"status": "Backend server is running ✅"}
```

---

## 📞 SUPPORT

If nothing works after trying all above steps:

1. Check **All 3 environment variables** one more time
2. Note down exact error message
3. Check both service **Logs** in Railway
4. Try **Restarting both services**:
   - Click service → Click three dots → Restart

---

## ✨ Next Steps (After Testing)

- ✅ Share app with farmers
- ✅ Collect feedback on accuracy
- ✅ Add more crop types
- ✅ Improve response times
- ✅ Add offline functionality

