# Database Setup (Firebase / Firestore)

The app ships with local JSON sample data so it runs with **zero** setup. When
you're ready to use a real database, follow these steps to connect Firebase.

## 1. Create a Firebase project
1. Go to <https://console.firebase.google.com> and click **Add project**.
2. Give it a name (e.g. `aw-barbershop`) and finish the wizard.

## 2. Enable Firestore
1. In the left menu choose **Build → Firestore Database**.
2. Click **Create database**, start in **production mode**, pick a region.

## 3. Enable Authentication (optional, for the admin login)
1. **Build → Authentication → Get started**.
2. Enable the **Email/Password** sign-in provider.

## 4. Register a web app & get your keys
1. Project Settings (gear icon) → **General** → **Your apps** → Web (`</>`).
2. Copy the `firebaseConfig` values.

## 5. Add the keys to your environment
Copy `frontend/.env.example` to `frontend/.env.local` and fill in:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 6. Wire up the config
1. Copy `database/firebase-config.template.js` → `database/firebase-config.js`.
2. Install the SDK in the frontend: `npm install firebase`.
3. Import `db` / `auth` from it where you currently read the JSON files.

## 7. Seed the database
Upload the contents of `database/sample-data/*.json` into matching Firestore
collections (`barbers`, `services`, `appointments`). You can do this manually in
the console, or write a short Node script using the Firebase Admin SDK.

## 8. Apply security rules
Paste the starter rules from `database/schema.md` into
**Firestore → Rules** and publish.

---

**Note:** `firebase-config.js` and `.env.local` are git-ignored on purpose —
never commit real API keys.
