// SkillNexus Firebase Initialization
// Directly configured with user's Firebase Project: skillnexus-b8fe0

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAh1qoldXwlONGVaDqM7dIniwyICIikRNw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "skillnexus-b8fe0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "skillnexus-b8fe0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "skillnexus-b8fe0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "477611242306",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:477611242306:web:e01148cd40a9452d33cedb",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9JYZ82444Z"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
auth.languageCode = "en";

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Analytics
export const analytics = (async () => {
  if (typeof window !== "undefined" && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
})();

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

// Auth helper exports
export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
};

export default app;
