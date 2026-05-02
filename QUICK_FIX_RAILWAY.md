# ⚡ QUICK FIX - Get Website Working in 5 Minutes

## 🎯 The Problem

Your website shows error: **"Cannot connect to backend server"**

## ✅ The Solution

The frontend needs to know where the backend is. Follow these 4 steps:

---

## STEP 1: Find Your Backend URL ⏱️ 30 seconds

1. Go to **railway.app**
2. Open your project
3. Look in left sidebar for services
4. Click each service and check its URL
   - Backend service will show: "Server running" in logs
   - Copy that service's public URL

**Example Backend URL:**
```
https://kissgpt-chatbot-backend-production.up.railway.app
```

---

## STEP 2: Update Frontend Configuration ⏱️ 1 minute

1. Go back to Railway dashboard
2. Find the **Frontend service** (the one with your app URL: kissgpt-chatbot-production...)
3. Click **"Variables"** tab
4. Find the variable called **`VITE_API_URL`**
5. Update its value to your backend URL from Step 1
6. Click **Save** button

**It should look like this:**
```
VITE_API_URL = https://kissgpt-chatbot-backend-production.up.railway.app
```

---

## STEP 3: Wait for Redeploy ⏱️ 2-3 minutes

1. Railway will automatically redeploy your frontend
2. Wait until you see green checkmark showing "Deployment successful"
3. You can watch logs if you want (optional)

---

## STEP 4: Test Your App ⏱️ 1 minute

1. Go to your app URL: `https://kissgpt-chatbot-production.up.railway.app`
2. Click "Analyze" page
3. Upload or take a crop photo
4. Click "Analyze"
5. **Should see result now** (not an error) ✅

---

## ✨ That's it!

All 3 features should now work:

- ✅ **Analyze** - Upload crop image, get disease detection
- ✅ **Chat** - Ask questions about crops
- ✅ **Weather** - Get weather info for your location

---

## 🐛 If It Still Doesn't Work

### Problem: Still seeing error after waiting 3 minutes

**Fix:**
1. Press `Ctrl + Shift + Delete` to clear cache
2. Close browser completely
3. Reopen and try again

### Problem: Can't find backend URL

**Fix:**
1. Look for a service with "backend" in the name
2. Click it, go to Logs tab
3. If you see "Express" or "🚀 Backend server" → That's the backend
4. Copy the domain shown at the top of that service

### Problem: Still not working

**Final resort:**
1. Go to Backend service in Railway
2. Click the three dots menu
3. Click "Restart"
4. Wait 2 minutes
5. Go to Frontend service
6. Click "Restart"
7. Wait 2 minutes
8. Test app again

---

## 📞 Need Help?

See these files for more details:
- [HOW_TO_FIND_BACKEND_URL.md](HOW_TO_FIND_BACKEND_URL.md) - More detailed guide
- [DEPLOYMENT_TESTING_GUIDE.md](DEPLOYMENT_TESTING_GUIDE.md) - Complete testing checklist
- [RAILWAY_PRODUCTION_FIX.md](RAILWAY_PRODUCTION_FIX.md) - Full troubleshooting

---

## ✅ DONE!

Your website should now be working on Railway with all 3 features:
- 🖼️ Crop Health Analysis (Prediction)
- 💬 Chat with Expert
- 🌤️ Weather Information

Enjoy! 🎉

