# Supabase Authentication Setup Guide for StockPulse Pro

## 🚀 Quick Setup Instructions

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project with these settings:
   - Name: `StockPulse Pro`
   - Database Password: (choose a secure password)
   - Region: (choose closest to your users)

### 2. Get Your Project Credentials
1. Go to `Settings` → `API` in your Supabase dashboard
2. Copy the following values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Update Environment Variables
Replace the values in your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Configure Authentication Providers

#### Email Authentication (Already Enabled)
✅ Email/Password authentication is enabled by default

#### Google OAuth Setup
1. Go to `Authentication` → `Providers` → `Google`
2. Enable Google provider
3. Add your Google OAuth credentials:
   - **Client ID**: Get from [Google Cloud Console](https://console.cloud.google.com)
   - **Client Secret**: Get from Google Cloud Console
4. Add redirect URLs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:5174/dashboard` (for development)

#### Phone Authentication Setup
1. Go to `Authentication` → `Providers` → `Phone`
2. Enable Phone provider
3. Configure SMS provider (Twilio recommended):
   - **Twilio Account SID**: From Twilio dashboard
   - **Twilio Auth Token**: From Twilio dashboard  
   - **Twilio Phone Number**: Your Twilio phone number

📋 **Detailed Twilio Setup**: See `TWILIO_SETUP.md` for complete step-by-step Twilio configuration guide.

### 5. Configure Site URL and Redirect URLs
1. Go to `Authentication` → `URL Configuration`
2. Set **Site URL**: `http://localhost:5174` (development)
3. Add **Redirect URLs**:
   - `http://localhost:5174/dashboard`
   - `https://yourdomain.com/dashboard` (production)

### 6. Enable Row Level Security (Optional but Recommended)
1. Go to `Authentication` → `Policies`
2. Create policies for your tables if you plan to store user data

## 🎯 Authentication Features Implemented

### ✅ Email/Password Authentication
- User registration with email verification
- Secure login with password
- Password reset functionality
- Remember me option

### ✅ Google OAuth
- One-click Google sign-in
- Automatic account creation
- Profile data import from Google

### ✅ Phone Number Authentication
- SMS OTP verification
- International phone number support
- Secure 6-digit verification codes

### ✅ User Management
- User sessions and state management
- Automatic token refresh
- Secure logout
- Profile data storage

## 🔧 Development vs Production

### Development Setup
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Production Setup
1. Update environment variables in your hosting platform
2. Configure production redirect URLs in Supabase
3. Set up custom domain (optional)
4. Enable additional security features

## 🛠️ Testing Authentication

### Test Email Authentication
1. Use any valid email format
2. Check your email for verification (in development, check Supabase Auth logs)
3. Complete registration process

### Test Google Authentication
1. Click "Continue with Google"
2. Complete Google OAuth flow
3. Verify automatic account creation

### Test Phone Authentication
1. Enter phone number with country code (e.g., +1234567890)
2. Receive SMS with verification code
3. Enter 6-digit code to complete authentication

## 📱 Mobile Considerations
- Deep linking for email verification
- App-specific redirect URLs
- Phone number formatting
- SMS delivery reliability

## 🔒 Security Best Practices
1. **Environment Variables**: Never commit real credentials to version control
2. **HTTPS**: Always use HTTPS in production
3. **Row Level Security**: Enable RLS for data protection
4. **Rate Limiting**: Configure rate limits for auth endpoints
5. **Email Verification**: Require email verification for new accounts

## 🚨 Troubleshooting

### Common Issues
1. **"Invalid API Key"**: Check your environment variables
2. **"Provider not enabled"**: Enable the provider in Supabase dashboard
3. **"Invalid redirect URL"**: Add your URL to allowed redirects
4. **SMS not received**: Check Twilio configuration and phone number format

### Debug Mode
Add this to your code for debugging:
```javascript
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, session);
});
```

## 🎉 You're Ready!
Once configured, your StockPulse Pro app will have:
- ✅ Secure user authentication
- ✅ Multiple sign-in options
- ✅ Professional user experience
- ✅ Scalable authentication infrastructure

For support, visit [Supabase Documentation](https://supabase.com/docs/guides/auth) or check the Supabase community.
