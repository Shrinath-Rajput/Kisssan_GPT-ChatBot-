# Railway Deployment Guide - Kissan GPT

## Prerequisites
- Railway account: https://railway.app
- GitHub repository with this code
- Gemini API Key: https://ai.google.dev/

## Deployment Steps

### Step 1: Add Environment Variable to Railway

1. Go to your Railway project dashboard
2. Click on the **Variables** tab (in the Environment section)
3. Click **New Variable**
4. Add the following variable:
   ```
   Name: VITE_GEMINI_API_KEY
   Value: your_actual_gemini_api_key_here
   ```
   
   **⚠️ IMPORTANT:** The variable MUST start with `VITE_` - this is how Vite exposes it to the frontend

5. Click **Add** and then **Deploy**

### Step 2: Update Your Code (If Not Already Done)

Push the latest code with these files updated:
- ✅ `vite.config.ts` - Has `loadEnv` and `define` config
- ✅ `services/geminiService.ts` - Uses `import.meta.env.VITE_GEMINI_API_KEY`
- ✅ `.env.example` - Documents the required variable

### Step 3: Deploy on Railway

Option A - Automatic (Recommended):
```bash
git add .
git commit -m "Fix: Properly configure environment variables for Railway deployment"
git push origin main
```
Railway will auto-deploy when you push to main.

Option B - Manual Redeploy:
1. Go to Railway Dashboard
2. Click **Deployments**
3. Find the latest deployment
4. Click **Redeploy**

### Step 4: Verify Deployment

After deployment completes (watch the logs), test these:

✅ **Test 1 - Analyze Page:**
- Go to Analyze tab
- Upload a clear image of Brinjal or Grape plant
- Should show disease analysis result (NOT "Failed to analyze image")

✅ **Test 2 - Chat Page:**
- Go to Chat tab
- Type "hello"
- Should respond with greeting (NOT "Error connecting to Kissan GPT")

✅ **Test 3 - Weather Page:**
- Go to Weather tab
- Should show actual temperature and weather (NOT "Detecting...")

## Troubleshooting

### Still seeing "Failed to analyze image"?
1. **Check Railway Logs:**
   - Go to Railway dashboard → Deployments → View Logs
   - Look for errors mentioning API key

2. **Verify Environment Variable:**
   - Go to Variables tab
   - Confirm `VITE_GEMINI_API_KEY` is set (with VITE_ prefix!)
   - Not `GEMINI_API_KEY` or `API_KEY`

3. **Redeploy:**
   - After setting/updating the variable, click **Deploy**
   - Wait for build and deployment to complete

### Browser Console Errors?
1. Open DevTools (F12)
2. Check Console tab for error messages
3. Common issues:
   - "API Key is missing" = Variable not set in Railway
   - "Failed to parse JSON" = Gemini API rate limited or invalid key

## Build Process on Railway

Railway automatically:
1. Detects `package.json` → Node.js app
2. Runs `npm install` → installs dependencies
3. Runs `npm run build` → builds with Vite
4. Runs `npm run preview` → starts the app

The build process reads environment variables with `VITE_` prefix and embeds them in the compiled code.

## Local Testing (Before Deploying)

```bash
# Create .env file locally
echo "VITE_GEMINI_API_KEY=your_test_key_here" > .env

# Run dev server
npm run dev

# Build for production (like Railway does)
npm run build

# Preview production build
npm run preview
```

## Questions?

- Railway Docs: https://docs.railway.app
- Vite Env Variables: https://vitejs.dev/guide/env-and-modes
- Gemini API: https://ai.google.dev/docs
