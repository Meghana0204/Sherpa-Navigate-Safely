
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBT8rgxrZPyDNd85BMtP-Dvta_hzOoCkTs",
  authDomain: "sherpa-gdg2025.firebaseapp.com",
  projectId: "sherpa-gdg2025",
  storageBucket: "sherpa-gdg2025.firebasestorage.app",
  messagingSenderId: "220103059490",
  appId: "1:220103059490:web:a2389d4f8265ff977bc27b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
