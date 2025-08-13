// Twilio Credentials Verification Script
// Run this to test your Twilio credentials directly

const ACCOUNT_SID = 'AC48c536c487279b138963e4c46801d1e7'; // Replace with your Account SID
const AUTH_TOKEN = 'eeee5db0d50836e90a35ee2f7a9acba5';   // Replace with your Auth Token

// Quick validation function
function validateTwilioCredentials() {
  console.log('🔍 Validating Twilio Credentials...\n');
  
  // Check Account SID format
  if (!ACCOUNT_SID.startsWith('AC')) {
    console.error('❌ Invalid Account SID: Must start with "AC"');
    return false;
  }
  
  if (ACCOUNT_SID.length !== 34) {
    console.error('❌ Invalid Account SID: Must be exactly 34 characters');
    return false;
  }
  
  // Check Auth Token format
  if (AUTH_TOKEN.length !== 32) {
    console.error('❌ Invalid Auth Token: Must be exactly 32 characters');
    return false;
  }
  
  console.log('✅ Account SID format: Valid');
  console.log('✅ Auth Token format: Valid');
  console.log('\n📋 Credentials to use in Supabase:');
  console.log(`Account SID: ${ACCOUNT_SID}`);
  console.log(`Auth Token: ${AUTH_TOKEN}`);
  
  return true;
}

// Test connection to Twilio (requires node.js and twilio package)
async function testTwilioConnection() {
  try {
    // Uncomment these lines if you have twilio package installed
    // const twilio = require('twilio');
    // const client = twilio(ACCOUNT_SID, AUTH_TOKEN);
    // const account = await client.api.accounts(ACCOUNT_SID).fetch();
    // console.log('✅ Twilio connection successful!');
    // console.log(`Account Status: ${account.status}`);
    
    console.log('💡 To test connection, install twilio package and uncomment lines above');
  } catch (error) {
    console.error('❌ Twilio connection failed:', error.message);
  }
}

// Run validation
if (validateTwilioCredentials()) {
  console.log('\n🚀 Credentials look good! Copy them to Supabase.');
  testTwilioConnection();
} else {
  console.log('\n🔧 Please fix the credential issues above.');
}

// Instructions
console.log('\n📝 Instructions:');
console.log('1. Replace ACCOUNT_SID and AUTH_TOKEN with your real values');
console.log('2. Run this script: node twilio-test.js');
console.log('3. If validation passes, copy credentials to Supabase');
console.log('4. Ensure no extra spaces when copying to Supabase');

export {}; // For TypeScript compatibility
