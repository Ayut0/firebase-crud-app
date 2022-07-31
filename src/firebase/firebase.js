// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBmtPtmfxAQwjTJh0tL4BBfbHDg7pPpEjg",
  authDomain: "react-crud-practice-4ab65.firebaseapp.com",
  projectId: "react-crud-practice-4ab65",
  storageBucket: "react-crud-practice-4ab65.appspot.com",
  messagingSenderId: "481413286477",
  appId: "1:481413286477:web:3e3f9c5517ea5274e9ea04",
  measurementId: "G-DFSYD8HWRC",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app)
const analytics = getAnalytics(app);
