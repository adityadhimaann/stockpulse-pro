#!/bin/bash

# 🧪 Test Google OAuth Fix
echo "🔍 Testing Google OAuth Configuration..."
echo

# Check if app is running
if curl -s http://localhost:5174 > /dev/null; then
    echo "✅ App is running on http://localhost:5174"
else
    echo "❌ App is not running. Start with: npm run dev"
    exit 1
fi

echo
echo "🎯 Testing Steps:"
echo "1. Open: http://localhost:5174"
echo "2. Click 'Sign in with Google'"
echo "3. Expected: Google login popup/redirect"
echo "4. Expected: Permission request for StockPulse Pro"
echo "5. Expected: Redirect back to dashboard"
echo

echo "✅ If successful, you should see:"
echo "   - No 'redirect_uri_mismatch' error"
echo "   - Google authentication flow"
echo "   - Logged in to your dashboard"
echo

echo "❌ If still failing:"
echo "   - Double-check redirect URI in Google Cloud Console"
echo "   - Ensure exactly: https://qqqpqmehpwgrqeciyclg.supabase.co/auth/v1/callback"
echo "   - No extra spaces or characters"
echo "   - Click Save in Google Cloud Console"
echo

echo "🚀 Ready to test! Open your browser and try Google login."
