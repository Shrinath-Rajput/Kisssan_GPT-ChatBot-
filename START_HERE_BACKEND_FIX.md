# 🆘 "Cannot connect to backend server" - START HERE

## You're Seeing This Error?

```
❌ Analysis Result
Cannot connect to backend server

FIX THIS:
1. Go to Railway Dashboard (railway.app)
2. Click your FRONTEND service
3. Go to Variables tab
4. Add: VITE_API_URL = https://your-backend-url.up.railway.app
5. Copy backend URL from your BACKEND service in Railway
6. Save and wait 2-3 minutes for redeploy
```

## 👇 Follow These 4 Steps (5 minutes total)

### Step 1: Get Backend URL
```
1. Open https://railway.app in browser
2. Click on your Backend service
3. Look at the top right - there's a Public URL
4. Copy it (looks like: https://kissan-gpt-backend-xyz.up.railway.app)
5. Keep this URL handy - you'll need it next
```

### Step 2: Set Environment Variable
```
1. Go back to Railway dashboard
2. Click on your FRONTEND service
3. Click the "Variables" tab
4. Click "New Variable"
5. Key: VITE_API_URL
6. Value: (paste the backend URL from Step 1)
7. Click Save
```

### Step 3: Verify Backend Configuration
```
1. Click on your BACKEND service
2. Click "Variables" tab
3. Check that GEMINI_API_KEY is set
   - Should have your actual API key
   - NOT empty or showing "your-api-key-here"
4. If missing, add your API key
```

### Step 4: Wait & Test
```
1. Wait 2-3 minutes (look for the checkmark in Railway)
2. Refresh your app in browser
3. Try uploading a crop image
4. Should see analysis results ✅
```

## ❓ Confused? Use These Guides

- **5-minute fix:** [QUICK_FIX_BACKEND.md](./QUICK_FIX_BACKEND.md)
- **Detailed setup:** [RAILWAY_SETUP_FINAL.md](./RAILWAY_SETUP_FINAL.md)
- **Troubleshooting:** [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)
- **All documents:** [BACKEND_SETUP_INDEX.md](./BACKEND_SETUP_INDEX.md)

## 🔍 Quick Diagnostics

### Test if it's working:
```
1. In browser, go to: https://your-backend.up.railway.app/health
2. Should show: { "status": "Backend server is running ✅" }
3. If you get an error, backend isn't accessible
```

### Check the logs:
```
1. Go to Railway Frontend service
2. Click "Logs" tab
3. Look for: "Using VITE_API_URL from environment"
4. If you see this, config is correct ✅
```

## 🎯 Most Common Mistakes

❌ **Wrong:**
```
VITE_API_URL = https://kissan-gpt-backend-xyz.up.railway.app/api
                                                              ^^^^
                                                          Don't include /api
```

✅ **Right:**
```
VITE_API_URL = https://kissan-gpt-backend-xyz.up.railway.app
```

❌ **Wrong:**
```
VITE_API_URL = http://localhost:8080
                This doesn't work on Railway production!
```

✅ **Right:**
```
VITE_API_URL = https://kissan-gpt-backend-xyz.up.railway.app
                Use your ACTUAL Railway backend URL
```

## 🆘 Still Not Working?

**Check this in order:**

1. **Is Backend URL correct?**
   - Copy from Railway backend service
   - Should start with https://
   - Should end with .up.railway.app

2. **Did you wait long enough?**
   - Wait full 2-3 minutes
   - Look for checkmark in Railway
   - Refresh browser after that

3. **Is GEMINI_API_KEY set?**
   - Go to Backend service Variables
   - Check GEMINI_API_KEY exists
   - Should be your actual API key

4. **Try these checks:**
   ```javascript
   // In browser console (F12)
   fetch('https://your-backend.up.railway.app/health')
   .then(r => r.json())
   .then(console.log)
   // Should show: { status: "Backend server is running ✅" }
   ```

5. **Still stuck?**
   - Check [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)
   - Follow the diagnostic checklist
   - Check Railway logs for errors

## 📚 Complete Reference

| Scenario | Document |
|----------|----------|
| I have 5 minutes | [QUICK_FIX_BACKEND.md](./QUICK_FIX_BACKEND.md) |
| I need detailed steps | [RAILWAY_SETUP_FINAL.md](./RAILWAY_SETUP_FINAL.md) |
| Something's wrong | [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md) |
| I want full details | [SOLUTION_COMPLETE.md](./SOLUTION_COMPLETE.md) |
| I need a guide | [BACKEND_SETUP_INDEX.md](./BACKEND_SETUP_INDEX.md) |

## ✅ Checklist

Before giving up, verify:
- [ ] Backend URL starts with `https://`
- [ ] Backend URL ends with `.up.railway.app`
- [ ] No `/api` at the end of URL
- [ ] VITE_API_URL is set in Frontend Variables
- [ ] GEMINI_API_KEY is set in Backend Variables
- [ ] 2-3 minutes have passed since changes
- [ ] You hit the checkmark/green status in Railway
- [ ] You refreshed the browser page

## 🎉 Done!

Once you see crop analysis working without errors, you're all set! ✅

The solution is simple - the app just needs to know where the backend service is on Railway.

---

**Need more help?** See the [complete documentation index](./BACKEND_SETUP_INDEX.md)
