// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore
import { getStorage } from "firebase/storage"; // Storage

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxQIXTHW8DVFST8ayw_2hINUp-N1RqxNM",
  authDomain: "moviereviews-9c185.firebaseapp.com",
  projectId: "moviereviews-9c185",
  storageBucket: "moviereviews-9c185.appspot.com",
  messagingSenderId: "56922254840",
  appId: "1:56922254840:web:b4bb7a1f19b106d42e7a0d",
  measurementId: "G-P04DQZP1WJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { firestore, storage };
