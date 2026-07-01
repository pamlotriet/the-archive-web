// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBts0h7bYd9Bj7xc2WPhzg-3ZMBXHuVk6E",
  authDomain: "the-archive-f2cfd.firebaseapp.com",
  projectId: "the-archive-f2cfd",
  storageBucket: "the-archive-f2cfd.firebasestorage.app",
  messagingSenderId: "870041772181",
  appId: "1:870041772181:web:e8a52c4412ea5faf853b9c",
  measurementId: "G-NZPREJLEEX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);