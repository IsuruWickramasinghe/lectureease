import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAky7GbL15VFVdFu55QJ_l2NeRLJ0cPc0",
  authDomain: "lecture-ease.firebaseapp.com",
  projectId: "lecture-ease",
  storageBucket: "lecture-ease.appspot.com",
  messagingSenderId: "207037086582",
  appId: "1:207037086582:web:6559aaa9bed1f543e09857",
  measurementId: "G-Q6KGXLPGWF"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);