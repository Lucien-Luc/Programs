# Corporate Programs Tracker

A comprehensive program management application designed to streamline program creation, tracking, and documentation for corporate environments.

## Features

- **Program Management**: Create, edit, and track corporate programs with detailed information
- **Document Upload**: Secure file upload system for program documentation (10MB limit)
- **Partner Management**: Track partner organizations for each program
- **Visual Branding**: Color-coded programs with image support
- **Professional Admin Interface**: Modern, corporate-style administrative dashboard
- **Firebase Integration**: Cloud-based data storage and authentication
- **PostgreSQL Support**: Local database option for enhanced performance

## Technologies

- **Frontend**: React.js, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM, Firebase Firestore
- **Authentication**: Firebase Auth with bcryptjs
- **File Storage**: Local filesystem with database metadata
- **Validation**: Zod for form validation
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Firebase project (for cloud features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd corporate-programs-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
   - Database connection string
   - Firebase configuration
   - Session secrets

5. Set up the database:
```bash
npm run db:push
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Environment Configuration

### Required Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `VITE_FIREBASE_API_KEY`: Firebase API key
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase auth domain
- `VITE_FIREBASE_PROJECT_ID`: Firebase project ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase storage bucket
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase messaging sender ID
- `VITE_FIREBASE_APP_ID`: Firebase app ID
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Firebase admin service account (JSON string)
- `SESSION_SECRET`: Session encryption secret

## Environment Variables

The following environment variables must be set for the application to run securely:

- `GOOGLE_TRANSLATE_API_KEY`: Your Google Translate API key (if using translation features)
- `ADMIN_PASSWORD`: Password for the admin user
- `SESSION_SECRET`: Secret for session management
- `DATABASE_URL`: Database connection string
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Firebase service account key (as a JSON string)
- `REPLIT_DOMAINS`, `REPL_ID`, `ISSUER_URL`: Required for Replit authentication (if using Replit integration)

Create a `.env` file in the root directory and add these variables with your own values. **Do not commit your `.env` file or any secrets to version control.**

## Deployment

### Replit Deployment

This project is optimized for Replit deployment:

1. Import the project to Replit
2. Configure environment variables in Replit Secrets
3. The project will automatically provision PostgreSQL
4. Click "Run" to start the application

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   └── lib/           # Utility functions
├── server/                 # Express backend
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database abstractions
│   └── auth.ts            # Authentication middleware
├── shared/                 # Shared types and schemas
└── uploads/               # File upload directory
```

## Security Features

- Environment variable-based configuration
- Sensitive files excluded from git
- Secure file upload validation
- Password hashing with bcryptjs
- Session-based authentication
- CORS protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.