import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";




  const firebaseConfig = {
  apiKey: "AIzaSyB4nhOog4-B1L_SXegvXoBBGBwsop-KWes",
  authDomain: "lost-and-found-da41a.firebaseapp.com",
  projectId: "lost-and-found-da41a",
  storageBucket: "lost-and-found-da41a.firebasestorage.app",
  messagingSenderId: "361384510313",
  appId: "1:361384510313:web:6538e128a5fb3ed5df33f8",
  measurementId: "G-YQXYV8KHZS"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);