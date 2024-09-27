import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithPopup, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc, getDocs, updateDoc, serverTimestamp, collection, writeBatch, deleteDoc } from 'firebase/firestore'; // Import Firestore
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage } from 'firebase/messaging'; // Import Firebase Messaging

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
const db = getFirestore(app); 
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const messaging = getMessaging(app); // Initialize Firebase Messaging

// Requesting permission and getting the FCM token
const requestPermissionAndGetToken = async () => {
  try {
    // Request permission to show notifications
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permission not granted for notification');
    }

    // Register the service worker and get the FCM token
    const token = await getToken(messaging, { 
      vapidKey: 'BNv1u7yGPOnDYNEHJtdNoYVCoKxtpBX7zRxhV9RbEdVoiNJr7DuZUuE6kXoYJvHt-T2fmlWaNDjCSRjHyn1cUzY' // Replace with your VAPID key
    });

    if (token) {
      console.log('FCM token:', token);
      return token;
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};


// Listen for messages in the foreground
onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
});

export { getFirestore, deleteDoc, storage, updateDoc, serverTimestamp, collection, writeBatch, doc, getDoc, getDocs, auth, provider, signInWithRedirect, signInWithPopup, sendPasswordResetEmail, getRedirectResult, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, db, messaging, requestPermissionAndGetToken };
