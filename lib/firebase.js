import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBxunOhfk9ZQX8c8upPTczKeQztK-mbSS4",
  authDomain: "mini-talabat-system.firebaseapp.com",
  projectId: "mini-talabat-system",
  databaseURL: "https://mini-talabat-system-default-rtdb.firebaseio.com/", // الرابط بتاعك هنا
  storageBucket: "mini-talabat-system.firebasestorage.app",
  messagingSenderId: "265112185415",
  appId: "1:265112185415:web:237b5ca571e91c2a425f62"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export { db };
