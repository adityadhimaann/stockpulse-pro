#!/bin/bash

# 🧪 Quick Test Script for Authentication
# Run this after completing Google OAuth setup

echo "🔍 Testing StockPulse Pro Authentication Setup..."
echo

# Check if environment variables are set (if using .env file)
if [ -f ".env" ]; then
    echo "✅ Found .env file"
    if grep -q "VITE_SUPABASE_URL" .env; then
        echo "✅ VITE_SUPABASE_URL found in .env"
    else
        echo "⚠️  VITE_SUPABASE_URL not found in .env"
    fi
    
    if grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo "✅ VITE_SUPABASE_ANON_KEY found in .env"
    else
        echo "⚠️  VITE_SUPABASE_ANON_KEY not found in .env"
    fi
else
    echo "ℹ️  No .env file found (using hardcoded values in supabase.ts)"
fi

echo
echo "📋 Pre-Flight Checklist:"
echo "□ Google Cloud Console project created"
echo "□ OAuth consent screen configured"
echo "□ OAuth 2.0 credentials created"
echo "□ Redirect URI added: https://qqqpqmehpwgrqeciyclg.supabase.co/auth/v1/callback"
echo "□ Google provider enabled in Supabase dashboard"
echo "□ Client ID and Secret entered in Supabase"
echo "□ Twilio credentials updated in Supabase (if using phone auth)"
echo

echo "🚀 To test:"
echo "1. Run: npm run dev"
echo "2. Go to http://localhost:3000"
echo "3. Try all authentication methods:"
echo "   - Email/Password registration"
echo "   - Email/Password login"
echo "   - Google OAuth login"
echo "   - Phone number login (SMS OTP)"
echo

echo "✨ Expected Results:"
echo "✅ Email auth: Should create account and login"
echo "✅ Google auth: Should redirect to Google, then back to app"
echo "✅ Phone auth: Should send SMS with OTP code"
echo "✅ All methods: Should redirect to dashboard after success"
echo

echo "🔧 If issues persist:"
echo "- Check browser console for errors"
echo "- Verify Supabase dashboard settings"
echo "- Double-check Google Cloud Console redirect URI"
echo "- Ensure all credentials are saved properly"
