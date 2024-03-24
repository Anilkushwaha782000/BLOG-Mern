// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-48438.firebaseapp.com",
  projectId: "mern-blog-48438",
  storageBucket: "mern-blog-48438.appspot.com",
  messagingSenderId: "564951457049",
  appId: "1:564951457049:web:8b228a02897cd4b3d6b988"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);