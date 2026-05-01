# 🚨 URGENT: Fix "Failed to fetch" Error on Railway

## THE PROBLEM
Frontend cannot reach backend because `VITE_API_URL` is not set on your frontend Railway service.

## STEP-BY-STEP FIX

### 1️⃣ FIND YOUR BACKEND URL
- Go to https://railway.app/dashboard
- Click on your **project**
- You'll see 2 services: one for FRONTEND, one for BACKEND
- Click on the **BACKEND service**
- Look for "PUBLIC_URL" or copy the URL from the top right
- It should look like: `https://your-backend-name.up.railway.app`

**NOTE:** Your backend URL is NOT `localhost:8080` - that's the internal port. The public URL is what you need.

### 2️⃣ SET THE ENVIRONMENT VARIABLE ON RAILWAY

**Option A: Using Railway Dashboard (Recommended)**
1. Go to https://railway.app/dashboard
2. Select your **FRONTEND service** (not backend)
3. Click **Variables** tab
4. Click **Add Variable**
5. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.up.railway.app` (paste the backend URL from step 1)
6. Click **Save** or press Enter

Railway will automatically redeploy your frontend.

**Option B: Using Railway CLI**
```bash
railway variables set VITE_API_URL=https://your-backend-url.up.railway.app
```

### 3️⃣ VERIFY BACKEND SERVICE HAS CORRECT CORS

In Railway backend service variables, confirm:
- `FRONTEND_URL=https://kissangpt-chatbot-production.up.railway.app`
- `GEMINI_API_KEY=AIzaSyAZxxr9LU88Ka9cQ0aecmkRlT260mdzCI4`

### 4️⃣ TEST THE FIX

1. Wait 2-3 minutes for Railway to redeploy
2. Go to: https://kissangpt-chatbot-production.up.railway.app
3. Open **Browser Console** (F12 → Console tab)
4. Look for messages showing which backend URL is being used
5. Try **Analyze** feature with a crop image
6. Try **Chat** feature

### 5️⃣ IF STILL NOT WORKING

Check browser console for:
- **"Backend API URL:"** message - shows what URL frontend is trying to use
- **"Connection Error"** - means backend URL is wrong or backend is down
- **"CORS Error"** - means backend CORS is not configured for your frontend URL

---

## QUICK CHECKLIST
- [ ] Found backend public URL from Railway dashboard
- [ ] Set `VITE_API_URL` variable on frontend Railway service
- [ ] Backend service has correct `FRONTEND_URL` and `GEMINI_API_KEY`
- [ ] Waited 2-3 minutes for redeploy
- [ ] Cleared browser cache (Ctrl+Shift+Delete)
- [ ] Tested on new incognito window (Ctrl+Shift+N)
- [ ] Checked browser console for errors

---

## EXAMPLE
If your backend Railway URL is: `https://crop-api-backend.up.railway.app`

Then set on **FRONTEND** service:
```
VITE_API_URL=https://crop-api-backend.up.railway.app
```

That's it! 🎉
