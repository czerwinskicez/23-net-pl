import React, { useEffect, useState } from 'react';
import { Fab } from '@mui/material';
import ReportIcon from '@mui/icons-material/Report';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../firebaseConfig'; // Import the Firebase configuration

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const db = getFirestore(app);
const auth = getAuth(app);

const ReportErrorFab = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleReportError = async () => {
    if (!user) {
      alert('You must be logged in to report an error.');
      return;
    }

    try {
      await addDoc(collection(db, 'reported_errors'), {
        message: 'Error reported by user',
        timestamp: new Date(),
        userId: user.uid,
      });
      alert('Error reported successfully!');
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Failed to report error.');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Fab
      color="secondary"
      aria-label="report error"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      onClick={handleReportError}
    >
      <ReportIcon />
    </Fab>
  );
};

export default ReportErrorFab;
