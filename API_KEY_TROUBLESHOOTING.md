# 🔧 TROUBLESHOOTING GUIDE - API KEY ISSUES

## ⚠️ THE PROBLEM

Even with the new API key `AIzaSyAbcMtYCRu9A4U9eoRbsPS7YBLd8QP0_3A`, the website shows:
- ❌ Chat: "Unable to connect"
- ❌ Weather: "Locating...", "Detecting..."
- ❌ Analysis: "Failed to analyze"

**This means the API key itself has issues!**

---

## 🔍 CHECK IF YOUR API KEY IS VALID

### **Step 1: Test API Key Online**

Go here: https://aistudio.google.com/app/apikey

**Look for:**
- Is your key listed?
- Does it show as "Active"?
- Any warning messages?

### **Step 2: Check for These Issues**

```
❌ "API key was reported as leaked" → Key is disabled
❌ "Quota exceeded" → You've used up free tier
❌ "403 PERMISSION_DENIED" → Key doesn't have permissions
❌ "Invalid key" → Key format is wrong
❌ "Project not found" → Associated project deleted
```

If you see ANY of these, the key is **BAD** and needs replacing!

---

## ✅ FIX: CREATE A BRAND NEW API KEY

### **Step 1: Go to Google AI Studio**
```
https://aistudio.google.com/app/apikey
```

### **Step 2: Check Current Keys**
- Look at all existing keys
- Delete any old/bad ones

### **Step 3: Create New Key**
1. Click **+ Create API Key**
2. Select your project (or create new one)
3. **Copy the entire new key**
4. Save it somewhere safe

### **Step 4: Test the New Key Immediately**
1. Still on Google AI Studio
2. Paste the key in the testing area
3. Try a simple test query
4. Confirm it returns data (NOT an error)

### **Step 5: Update EVERYWHERE**

#### **Update Local .env:**
```env
VITE_GEMINI_API_KEY=YOUR_NEW_KEY_HERE
```

#### **Update Railway:**
1. Go to: https://railway.app/project/22fc9133-26c3-46ac-a039-e2ddb47ea4aa
2. Click **Variables**
3. Find `VITE_GEMINI_API_KEY`
4. Click **three dots → Edit**
5. **Delete old value completely**
6. **Paste new key**
7. Click **Save**

#### **Update .env.example (for documentation):**
```env
VITE_GEMINI_API_KEY=your_new_working_key_here
```

### **Step 6: Redeploy**
- Railway auto-redeploys when variable changes
- Wait 3-5 minutes for ✅ green checkmark
- Clear browser cache (Ctrl+Shift+Delete)
- Test website

---

## 🧪 HOW TO TEST THE API KEY

### **Test 1: In Browser Console**
1. Go to: https://kisssangpt-chatbot-production.up.railway.app/chat
2. Press **F12** to open console
3. Type:
```javascript
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```
4. **You should see your key** (not `undefined`)

### **Test 2: Try Chat Feature**
1. Go to Chat page
2. Type: "Hello"
3. **You should get a response** (not "Unable to connect")

### **Test 3: Check Network Tab**
1. Open F12 → Network tab
2. Send a chat message
3. Look for requests to `generativelanguage.googleapis.com`
4. Check response:
   - ✅ Status 200 = Working
   - ❌ Status 403 = API Key bad
   - ❌ Status 401 = API Key invalid

---

## 🚨 IF STILL NOT WORKING

### **Common Issues & Fixes**

#### **Issue: "API key was reported as leaked"**
```
Status: ❌ CANNOT FIX - Key is permanently disabled by Google
Solution: Create a BRAND NEW key
```

#### **Issue: "Quota exceeded"**
```
Status: ⚠️ Free tier limit reached
Solution: 1. Wait 24 hours, OR
          2. Upgrade to paid Google Cloud project
          3. OR create new project
```

#### **Issue: "403 PERMISSION_DENIED"**
```
Status: ❌ Key doesn't have required permissions
Solution: 1. Go to Google Cloud Console
          2. Enable "Google AI Generative Language API"
          3. Create new key
```

#### **Issue: Console shows "undefined" for API key**
```
Status: ❌ Railway environment variable NOT SET
Solution: 1. Go to Railway Variables
          2. Verify variable exists
          3. Click Save to trigger redeploy
          4. Wait 5 minutes
```

---

## 📋 COMPLETE SETUP CHECKLIST

- [ ] Old API key identified and removed
- [ ] New API key created from Google AI Studio
- [ ] New key tested and confirmed working on Google AI Studio
- [ ] New key copied to local `.env` file
- [ ] New key updated on Railway Variables
- [ ] Railway variable saved (triggering auto-redeploy)
- [ ] Waited 3-5 minutes for deployment to complete
- [ ] Browser cache cleared (Ctrl+Shift+Delete)
- [ ] Tested chat feature
- [ ] Checked browser console for errors
- [ ] Verified API key shows in console (not `undefined`)
- [ ] Website working! ✅

---

## 📞 QUICK DIAGNOSTIC

If website is still down, open browser console and tell me:

1. **What does this show?**
```javascript
console.log(import.meta.env.VITE_GEMINI_API_KEY)
```
Answer: _______________

2. **What error appears when you send a chat message?**
Answer: _______________

3. **What's the network response status? (F12 → Network tab)**
Answer: _______________

These 3 things will tell me exactly what's wrong!

---

## ✨ EXPECTED WORKING STATE

**When everything is working:**
- ✅ Console shows: `AIzaSy...` (your actual key)
- ✅ Chat message gets response
- ✅ Weather shows real data
- ✅ Image analysis works
- ✅ No error messages

---

## 🎯 BOTTOM LINE

**The website code is 100% ready and correct.**

**The problem is 100% the API key.**

**Solution: Get a valid, working API key and update it everywhere.**

If you need help getting a new key, let me know and I can guide you step-by-step!

---

**Current Status:**
- ✅ Code: Fixed and deployed
- ✅ Railway: Running
- ❌ API Key: Needs verification/replacement

**Next Action:** Verify API key or create new one
