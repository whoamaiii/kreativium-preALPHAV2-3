# Ask123 - Tegn til Tale

## Firebase Setup

1. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add Project" and follow the setup wizard
   - Enable Authentication, Firestore, and Storage services

2. Get Firebase configuration:
   - In Firebase Console, go to Project Settings
   - Under "General" tab, scroll to "Your apps"
   - Click the web icon (`</>`)
   - Register your app and copy the configuration

3. Configure environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

4. Edit `.env` and add your Firebase configuration:
   - Open `.env` in your editor
   - Replace placeholder values with your Firebase config
   - Ensure API key starts with 'AIza'
   - Save the file

5. Required environment variables:
   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

## Troubleshooting

If you see a Firebase API key error:
1. Check that your API key in `.env` starts with 'AIza'
2. Verify all Firebase configuration values are correct
3. Ensure there are no spaces or quotes around the values
4. Restart the development server

For more help, see the [Firebase Documentation](https://firebase.google.com/docs)