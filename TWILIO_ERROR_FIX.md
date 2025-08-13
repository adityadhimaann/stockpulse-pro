# 🚨 TWILIO ERROR 20003 - AUTHENTICATION FIX

## Your Error: "Authentication Error - invalid username"

This error means Supabase cannot authenticate with Twilio using the credentials you provided.

## ✅ IMMEDIATE FIX CHECKLIST

### 1. Get Correct Credentials from Twilio

**Go to Twilio Console:** https://console.twilio.com

**Account SID:**
- [ ] Located at the top of the console dashboard
- [ ] Starts with `AC` (this is crucial!)
- [ ] Exactly 34 characters total
- [ ] Example: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Auth Token:**
- [ ] Click the "View" button next to "Auth Token"
- [ ] Copy the ENTIRE token (exactly 32 characters)
- [ ] No spaces, no line breaks
- [ ] Case-sensitive!

### 2. Clear Supabase Configuration

**Go to Supabase:** https://app.supabase.com → Your Project

**Clear Phone Provider:**
- [ ] Authentication → Providers → Phone
- [ ] Delete everything in Twilio Account SID field
- [ ] Delete everything in Twilio Auth Token field
- [ ] Delete everything in Twilio Phone Number field

### 3. Re-enter Credentials CAREFULLY

**Paste Fresh Credentials:**
- [ ] Paste Account SID (should start with AC)
- [ ] Paste Auth Token (exactly 32 characters)
- [ ] Paste Phone Number (+1234567890 format)
- [ ] Double-check for extra spaces
- [ ] Click Save

### 4. Test Phone Number Format

**Your phone number must be:**
- [ ] Include country code: `+1` for US
- [ ] No spaces: `+1234567890`
- [ ] No dashes: `+1234567890`
- [ ] No parentheses: `+1234567890`

## 🔧 COMMON MISTAKES TO AVOID

### ❌ Wrong Account SID
```
Wrong: SK... (This is an API Key, not Account SID)
Wrong: AC123 (Too short)
Right: ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### ❌ Wrong Auth Token
```
Wrong: Copied from wrong field
Wrong: Only part of the token
Right: Exactly 32 characters, case-sensitive
```

### ❌ Wrong Phone Number
```
Wrong: 123-456-7890
Wrong: (123) 456-7890
Wrong: 1234567890
Right: +1234567890
```

## 🧪 TEST YOUR SETUP

### Method 1: Test from Supabase
1. Go to Authentication → Users
2. Click "Invite User" → "Phone"
3. Enter YOUR phone number: `+1234567890`
4. Check if you receive SMS

### Method 2: Test from Your App
1. Open StockPulse Pro
2. Click "Phone" authentication
3. Enter your phone number
4. Should receive OTP within 30 seconds

## 🔍 STILL NOT WORKING?

### Check Twilio Account Status
1. **Go to:** https://console.twilio.com
2. **Check:** Account status (active/suspended)
3. **Verify:** Phone number ownership
4. **Confirm:** SMS capability enabled

### Check Twilio Console Logs
1. **Go to:** Monitor → Logs → Errors
2. **Look for:** Recent error messages
3. **Check:** Phone number validity
4. **Verify:** Message delivery status

### Trial Account Limitations
- [ ] Trial accounts can only send to verified numbers
- [ ] Add your phone number to verified caller IDs
- [ ] Go to Phone Numbers → Verified Caller IDs

## 💡 QUICK VERIFICATION COMMANDS

Run this in your browser console on Twilio page:
```javascript
// Check if Account SID is correct format
const sid = 'your_account_sid_here';
console.log('Valid SID:', sid.startsWith('AC') && sid.length === 34);
```

## 🎯 FINAL VERIFICATION

After fixing, you should see:
- [ ] ✅ No authentication errors in Supabase logs
- [ ] ✅ SMS received on your phone
- [ ] ✅ OTP verification works in your app
- [ ] ✅ Twilio console shows successful message delivery

## 📞 NEED HELP?

If you're still stuck:
1. **Twilio Support:** https://support.twilio.com
2. **Supabase Discord:** https://discord.supabase.com
3. **Check error codes:** https://www.twilio.com/docs/errors/20003

Remember: 99% of authentication errors are due to incorrect credentials entry!
