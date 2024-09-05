// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBDgWJsz_XeK5FdULOmXPKE4b1x8W2ud7s',
  authDomain: 'yuganthara-640bf.firebaseapp.com',
  projectId: 'yuganthara-640bf',
  storageBucket: 'yuganthara-640bf.appspot.com',
  messagingSenderId: '794998479718',
  appId: '1:794998479718:web:29e0a1ec06aedc2bebc6a7',
  measurementId: 'G-T9B6MN53L3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const storage = getStorage(app);
export { db };
