
# Security Setup Instructions

## ⚠️ IMPORTANT: Environment Variables Setup

This application requires several environment variables to function properly. **Never commit sensitive credentials to version control.**

## Required Environment Variables

### 1. Firebase Client Configuration
Set these in Replit Secrets or create a local `.env` file:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Firebase Admin Service Account
Set this in Replit Secrets (copy the entire JSON as one line):

```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your_project_id","private_key":"your_private_key_here"}
```

### 3. Session Secret
For secure sessions (generate a random string):

```bash
SESSION_SECRET=your_random_session_secret_here
```

## How to Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to Project Settings (gear icon)
4. In the "General" tab, find your web app config for client credentials
5. For the service account:
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Copy the entire JSON content as a string for `FIREBASE_SERVICE_ACCOUNT_KEY`

## Setting Up in Replit

1. Click on "Secrets" (lock icon) in the left sidebar
2. Add each environment variable as a separate secret
3. The app will automatically use these values

## Setting Up Locally

1. Copy `.env.example` to `.env`
2. Fill in your actual credentials
3. **Never commit the `.env` file**

## Security Notes

- ✅ All sensitive data has been removed from the codebase
- ✅ `.env` files are gitignored
- ✅ Service account JSON files are gitignored
- 🔒 Always use Replit Secrets for production deployments
- 🔒 Regenerate service account keys if they are ever exposed
- 🔒 Use strong, random session secrets in production

## GitHub Repository Safety

This codebase is now safe to push to GitHub as:
- No hardcoded credentials remain in the code
- All sensitive files are properly gitignored
- Environment variables must be set separately in each deployment environment
