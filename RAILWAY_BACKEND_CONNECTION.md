# How to Connect Frontend to Backend on Railway

## Current Error
The frontend shows "Cannot connect to backend server" because it doesn't know where the backend service is located.

## Solution: Set Backend URL in Railway

### Step 1: Get Your Backend Service URL
1. Go to [Railway Dashboard](https://railway.app)
2. Click on your **Backend** service
3. Go to the **Settings** tab
4. Find and copy the **Public Domain** URL (looks like: `https://your-backend-xxxxx.up.railway.app`)

### Step 2: Configure Frontend Service
1. In Railway Dashboard, click on your **Frontend** service
2. Go to the **Variables** tab
3. Add a new variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Paste your backend URL (e.g., `https://your-backend-xxxxx.up.railway.app`)
4. Click **Save** or **Deploy**

### Step 3: Wait for Redeploy
- Railway will automatically redeploy the frontend with the new environment variable
- Wait 2-3 minutes for the deployment to complete
- Check the **Deployments** tab to see the status

### Step 4: Test the Connection
- Refresh your frontend app
- Go to the "Analyze" page
- You should now see the form without the "Cannot connect to backend server" error

## Technical Details

### How It Works
- The frontend runs a **proxy server** that routes API calls to the backend
- The proxy reads `VITE_API_URL` environment variable
- All requests to `/api/*` are forwarded to your backend service

### Environment Variables
| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend service full URL | `https://backend-xxxxx.up.railway.app` |
| `BACKEND_HOST` | (Local dev only) Backend hostname | `localhost` |
| `BACKEND_PORT` | (Local dev only) Backend port | `8080` |

### Troubleshooting
If you still see "Cannot connect to backend server":

1. **Check backend is running**: Visit your backend URL directly in a browser
   - You should see a response (or an error that's not a timeout)

2. **Verify the URL is correct**: 
   - Remove trailing slashes from the URL
   - URL should be like: `https://backend-xxxxx.up.railway.app` (not `/api`)

3. **Check proxy logs**:
   - Go to Frontend service → Deployments → View Logs
   - Look for "Backend URL:" to see what URL is being used

4. **Redeploy if needed**:
   - Make a small change to trigger a new deployment
   - Or use Railway CLI: `railway deploy`

## For Local Development

If running locally:
```bash
# Terminal 1: Start backend
cd backend
npm install
npm start

# Terminal 2: Start frontend
npm run build
npm run proxy

# Frontend proxy will automatically use localhost:8080
```

## Related Files
- [`proxy-server.js`](proxy-server.js) - Proxy configuration
- [`Dockerfile`](Dockerfile) - Production setup
- [`services/apiClient.ts`](services/apiClient.ts) - Frontend API client
