
// Import the necessary functions from the Firebase SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCPej2ArKQP-mje6Kaj3_7HwABvcNUSndM",
  authDomain: "pantryapp-37e88.firebaseapp.com",
  projectId: "pantryapp-37e88",
  storageBucket: "pantryapp-37e88.appspot.com",
  messagingSenderId: "971013063259",
  appId: "1:971013063259:web:3b8bf65d7466bbfddf757e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const firestore = getFirestore(app);
