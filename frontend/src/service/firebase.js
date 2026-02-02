// src/service/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBhUqa4ek-tIbhbOqXBaLw-eEq4HSoiBXI",
  authDomain: "cloud251110-junhwan1310.firebaseapp.com",
  projectId: "cloud251110-junhwan1310",
  storageBucket: "cloud251110-junhwan1310.firebasestorage.app",
  messagingSenderId: "955110549507",
  appId: "1:955110549507:web:86590dc8f33a6bdb3e4636"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };