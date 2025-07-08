import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlsoSzL2Vs1dDkaHP_PVjW3BX3Z37OX6A",
  authDomain: "programs-tracker.firebaseapp.com",
  projectId: "programs-tracker",
  storageBucket: "programs-tracker.firebasestorage.app",
  messagingSenderId: "153371793102",
  appId: "1:153371793102:web:90a9d388aebb9c566b629f",
  measurementId: "G-WJ9RDMHPH9"
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let googleProvider: any = null;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  googleProvider = new GoogleAuthProvider();
} catch (error) {
  console.warn("Firebase initialization failed, falling back to server API:", error);
  // Firebase initialization failed, will use server API as fallback
}

export { auth, db, storage, googleProvider };
export default app;