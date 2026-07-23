import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, off } from 'firebase/database';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const databaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;

let isFirebaseConnected = false;
let db = null;

if (apiKey && databaseURL && apiKey !== "" && databaseURL !== "") {
  try {
    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      databaseURL: databaseURL,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };

    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    isFirebaseConnected = true;
    console.log("Firebase Live Database successfully connected! 🌐⚡");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase credentials not configured. Falling back to LocalStorage offline database mode.");
}

export { db, isFirebaseConnected };

// Sync wrappers
export const syncProductsToCloud = (products) => {
  if (isFirebaseConnected && db) {
    set(ref(db, 'products'), products);
  }
};

export const syncTransactionsToCloud = (transactions) => {
  if (isFirebaseConnected && db) {
    set(ref(db, 'transactions'), transactions);
  }
};
