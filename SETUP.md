# Setup Guide for Corporate Programs Tracker

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "corporate-programs-tracker")
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Services

1. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode"
   - Select location closest to your users

2. **Authentication**:
   - Go to Authentication
   - Click "Get started"
   - Enable Email/Password provider

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Choose security rules mode

### 3. Get Configuration

1. **Web App Configuration**:
   - Go to Project Settings (gear icon)
   - Click "Add app" → Web app
   - Register app name
   - Copy the config object values to your `.env` file

2. **Service Account Key**:
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file
   - Convert to single line JSON string for `FIREBASE_SERVICE_ACCOUNT_KEY`

### 4. Configure Security Rules

Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## PostgreSQL Setup

### Option 1: Replit (Automatic)

Replit will automatically provision PostgreSQL when you run the project.

### Option 2: Local Setup

1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE programs_tracker;
```
3. Update `DATABASE_URL` in `.env`
4. Run migrations:
```bash
npm run db:push
```

## Environment Variables Setup

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

### Required Variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `VITE_FIREBASE_*`: Firebase web app config values
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Firebase admin SDK JSON (as string)
- `SESSION_SECRET`: Random secret for session encryption

### Getting Firebase Service Account JSON:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Convert to single line string:

```bash
# Remove newlines and format as single line
cat firebase-adminsdk-xxx.json | jq -c .
```

5. Paste the result as `FIREBASE_SERVICE_ACCOUNT_KEY` value

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Set up database schema:
```bash
npm run db:push
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:5000

## Production Deployment

### Environment Variables for Production:

Ensure all environment variables are properly set in your production environment.

### Build Process:

```bash
npm run build
npm start
```

## Troubleshooting

### Firebase Connection Issues:
- Verify all environment variables are set
- Check Firebase project settings
- Ensure service account has proper permissions

### Database Issues:
- Verify DATABASE_URL format
- Check PostgreSQL is running
- Run `npm run db:push` to sync schema

### Upload Issues:
- Ensure `uploads/` directory exists
- Check file permissions
- Verify 10MB file size limit

## Security Checklist

- [ ] All environment variables are set
- [ ] Firebase security rules are configured
- [ ] No sensitive files in git repository
- [ ] Session secret is strong and random
- [ ] File upload validation is working
- [ ] Database connection is secured