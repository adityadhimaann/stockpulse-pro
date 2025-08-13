# 🔧 Fix Google OAuth "redirect_uri_mismatch" Error

## Error Details
```
Error 400: redirect_uri_mismatch
You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy.
redirect_uri=https://qqqpqmehpwgrqeciyclg.supabase.co/auth/v1/callback
```

## 🎯 Solution Steps

### Step 1: Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project (or create one if you haven't)

### Step 2: Enable Google+ API
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API" 
3. Click **Enable** if not already enabled

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required fields:
   - App name: `StockPulse Pro`
   - User support email: Your email
   - Developer contact email: Your email
4. Click **Save and Continue**
5. Skip scopes (click **Save and Continue**)
6. Add test users (your email)
7. Click **Save and Continue**

### Step 4: Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Name: `StockPulse Pro Supabase`

### Step 5: Add Redirect URI (CRITICAL!)
In the **Authorized redirect URIs** section, add:
```
https://qqqpqmehpwgrqeciyclg.supabase.co/auth/v1/callback
```

⚠️ **IMPORTANT**: Copy this EXACTLY from your error message!

### Step 6: Get Your Credentials
1. Click **Create**
2. Copy your **Client ID** and **Client Secret**
3. Save them securely

### Step 7: Configure Supabase
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** and click to enable it
5. Enter your Google credentials:
   - **Client ID**: (from Step 6)
   - **Client Secret**: (from Step 6)
6. Click **Save**

### Step 8: Test the Integration
1. Go back to your app
2. Try clicking "Sign in with Google"
3. It should now work without the redirect error!

## 🔍 Troubleshooting

### If you still get redirect_uri_mismatch:
1. Double-check the redirect URI in Google Cloud Console
2. Make sure there are no extra spaces
3. Verify it matches exactly: `https://qqqpqmehpwgrqeciyclg.supabase.co/auth/v1/callback`

### If Google provider is still not enabled:
1. Make sure you clicked **Save** in Supabase
2. Check that both Client ID and Secret are filled in
3. Refresh the Supabase dashboard

### Common Issues:
- **Wrong redirect URI**: Must match exactly from error message
- **API not enabled**: Enable Google+ API in Google Cloud Console
- **Consent screen not configured**: Complete OAuth consent screen setup
- **Test user not added**: Add your email as a test user

## 📋 Quick Checklist
- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URI added: `https://qqqpqmehpwgrqeciyclg.supabase.co/auth/v1/callback`
- [ ] Client ID and Secret copied
- [ ] Google provider enabled in Supabase
- [ ] Credentials entered in Supabase
- [ ] Settings saved in Supabase

## 🎉 Success!
Once all steps are complete, your Google OAuth should work perfectly with your StockPulse Pro authentication system!
