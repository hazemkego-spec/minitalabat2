import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// إعدادات مشروعك الخاصة بـ Mini Talabat
const firebaseConfig = {
  apiKey: "AIzaSyBxunOhfk9ZQX8c8upPTczKeQztK-mbSS4",
  authDomain: "mini-talabat-system.firebaseapp.com",
  projectId: "mini-talabat-system",
  databaseURL: "https://mini-talabat-system-default-rtdb.firebaseio.com/",
  storageBucket: "mini-talabat-system.firebasestorage.app",
  messagingSenderId: "265112185415",
  appId: "1:265112185415:web:237b5ca571e91c2a425f62"
};

// التأكد من تهيئة التطبيق مرة واحدة فقط لضمان استقرار الأداء على الموبايل
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ربط قاعدة البيانات Realtime Database
const db = getDatabase(app);

export { db };
