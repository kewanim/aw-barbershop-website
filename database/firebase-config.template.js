// ---------------------------------------------------------------------------
// Firebase configuration TEMPLATE
//
// 1. Copy this file to `firebase-config.js`.
// 2. Replace the placeholder values with the keys from your Firebase project
//    (Project Settings → General → Your apps → SDK setup and configuration).
// 3. Better still, read them from environment variables so secrets never get
//    committed to git (see frontend/.env.example and config/.env.example).
//
// This initializes the Firebase client SDK and exports the Firestore database
// and Auth instances used throughout the app.
// ---------------------------------------------------------------------------

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Values come from environment variables (recommended) with placeholder
// fallbacks so it's obvious what to fill in.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:000000000000:web:abcdef",
};

// Initialize Firebase and export the services we use.
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
