import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAh5sxUv-VwAb9DYsuzCORiP4sliDYNXhs",
    authDomain: "inventory-tracker-app-14c0c.firebaseapp.com",
    databaseURL: "https://inventory-tracker-app-14c0c-default-rtdb.firebaseio.com",
    projectId: "inventory-tracker-app-14c0c",
    storageBucket: "inventory-tracker-app-14c0c.appspot.com",
    messagingSenderId: "688503258219",
    appId: "1:688503258219:web:dc687a40d2a491a50ac52e"
 };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };