# 🔧 Fix Google OAuth "Provider Not Enabled" Error

## Your Error:
```json
{"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

## Cause:
Google OAuth provider is not enabled in your Supabase project.

## ✅ IMMEDIATE FIX:

### Step 1: Enable Google Provider in Supabase
1. **Go to**: https://app.supabase.com
2. **Select**: Your StockPulse Pro project
3. **Navigate**: Authentication → Providers
4. **Find**: Google provider in the list
5. **Click**: The toggle to enable Google
6. **Status**: Should show "Enabled" 

### Step 2: Add Google OAuth Credentials (Required)
**You need Google OAuth credentials from Google Cloud Console:**

#### Get Google OAuth Credentials:
1. **Go to**: https://console.cloud.google.com
2. **Create project** (if you don't have one)
3. **Enable Google+ API** or **Google Identity API**
4. **Go to**: Credentials → Create Credentials → OAuth 2.0 Client IDs
5. **Application type**: Web application
6. **Name**: StockPulse Pro
7. **Authorized redirect URIs**: Add this URL:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
8. **Create** and copy:
   - **Client ID**: `xxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPXxxx`

#### Add to Supabase:
1. **Back in Supabase**: Authentication → Providers → Google
2. **Paste Client ID**: From Google Cloud Console
3. **Paste Client Secret**: From Google Cloud Console
4. **Save**

### Step 3: Quick Setup (Alternative)
**If you want to test immediately without Google credentials:**

**Temporarily disable Google authentication** in your Auth component:

```typescript
// In components/pages/Auth.tsx, comment out Google button:
// <Button onClick={handleGoogleAuth}>Google</Button>
```

### Step 4: Test Google Authentication
1. **After enabling**: Google provider should work
2. **Click Google button** in your app
3. **Should redirect** to Google OAuth flow
4. **Should create user** and sign in automatically

## 🚨 Common Issues:

### Issue: "redirect_uri_mismatch"
**Fix**: Add correct redirect URI in Google Cloud Console:
```
https://your-project-ref.supabase.co/auth/v1/callback
```

### Issue: "invalid_client"
**Fix**: Double-check Client ID and Secret in Supabase

### Issue: Still getting "provider not enabled"
**Fix**: 
1. Refresh Supabase page
2. Ensure Google toggle is ON
3. Check that Client ID/Secret are saved

## 📋 Verification Checklist:
- [ ] Google provider enabled in Supabase
- [ ] Google Cloud Console project created
- [ ] OAuth credentials generated
- [ ] Client ID added to Supabase
- [ ] Client Secret added to Supabase
- [ ] Redirect URI configured correctly
- [ ] Test Google sign-in from your app
