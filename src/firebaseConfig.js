import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs } from 'firebase/firestore'; // Import Firestore

const firebaseConfig = {
  apiKey: "AIzaSyDzqu9SzaFROpXB6bzjF6CNUurVUXcKZaA",
  authDomain: "beta-23-net-pl.firebaseapp.com",
  projectId: "beta-23-net-pl",
  storageBucket: "beta-23-net-pl.appspot.com",
  messagingSenderId: "639464504451",
  appId: "1:639464504451:web:96b85adc0d42164bea6fb6",
  measurementId: "G-F5MTTD83WD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore
const provider = new GoogleAuthProvider();

export { getFirestore, doc, getDoc, getDocs, auth, provider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, db }; // Export Firestore
