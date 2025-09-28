const fs = require('fs');
const path = require('path');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {

  // Read and check the file
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiKey = envContent.includes('NEXT_PUBLIC_FIREBASE_API_KEY=') &&
                   !envContent.includes('your_api_key_here');
} else {

  const envTemplate = `# Firebase Configuration
# Get these values from Firebase Console > Project Settings > General > Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin SDK (for server-side operations)
NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id",...}

# Super Admin Creation (optional)
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=admin123456
SUPER_ADMIN_NAME=Super Admin
`;

  try {
    fs.writeFileSync(envPath, envTemplate);

  } catch (error) {

  }
}
