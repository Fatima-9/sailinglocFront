// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtpOMtw3GR5yZhokfVox8eP9Ldo5srLrE",
  authDomain: "mypictures-9dc8b.firebaseapp.com",
  projectId: "mypictures-9dc8b",
  storageBucket: "mypictures-9dc8b.firebasestorage.app",
  messagingSenderId: "722783244073",
  appId: "1:722783244073:web:e29da99ccd0602e2b3b138"
};

// Initialize Firebase (empêche l'erreur duplicate-app)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);        // Authentication
export const db = getFirestore(app);     // Firestore Database
export const storage = getStorage(app);   // Storage

// Debug: Vérifier la configuration Storage
console.log('Firebase Storage configuré:', storage);
console.log('Storage bucket:', firebaseConfig.storageBucket);

export default app;