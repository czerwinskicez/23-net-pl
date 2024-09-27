// Import the functions you need from the SDKs you need
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDzqu9SzaFROpXB6bzjF6CNUurVUXcKZaA",
    authDomain: "beta-23-net-pl.firebaseapp.com",
    projectId: "beta-23-net-pl",
    storageBucket: "beta-23-net-pl.appspot.com",
    messagingSenderId: "639464504451",
    appId: "1:639464504451:web:96b85adc0d42164bea6fb6",
    measurementId: "G-F5MTTD83WD"
  };

// Initialize the Firebase app
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // You can customize this icon
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
