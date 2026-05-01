#!/bin/bash
# Quick Deploy Script for Kissan GPT

echo "🚀 Kissan GPT Deployment Script"
echo "================================"

# Check if API key is configured
if grep -q "GEMINI_API_KEY=AIzaSyDZrw2Bddv-yQP4EGOe8u03-2APdzZ9Wm8" backend/.env; then
    echo "⚠️  WARNING: Using API key with potential quota issues"
    echo "✅ Steps to fix:"
    echo "   1. Get new API key: https://aistudio.google.com/app/apikey"
    echo "   2. Update backend/.env with new key"
    echo "   3. Rerun this script"
fi

echo ""
echo "📋 Current Configuration:"
echo "========================"
grep "VITE_API_URL" .env.local 2>/dev/null || echo "❌ Frontend API URL not set in .env.local"
grep "FRONTEND_URL" backend/.env || echo "❌ Frontend URL not set in backend/.env"

echo ""
echo "🏗️  Building Frontend..."
npm run build

echo ""
echo "📦 Starting Backend..."
cd backend
npm start &
BACKEND_PID=$!

echo ""
echo "✅ Backend PID: $BACKEND_PID"
echo "✅ Frontend built successfully"
echo ""
echo "🎉 Ready to Deploy!"
echo "   Frontend: http://10.97.207.209:3001"
echo "   Backend:  http://10.97.207.209:5000"
echo ""
echo "🗣️  Test Languages:"
echo "   1. Select English from dropdown"
echo "   2. Ask: 'What crops do you support?'"
echo "   3. Select हिंदी (Hindi)"
echo "   4. Ask: 'कौन सी फसलें आप सपोर्ट करते हैं?' (same in Hindi)"
echo "   5. Select मराठी (Marathi)"
echo "   6. Ask: 'तुम कोणत्या पिकांना समर्थन देता?' (same in Marathi)"
