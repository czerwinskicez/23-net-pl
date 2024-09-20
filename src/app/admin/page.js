"use client";

import React, { useEffect, useState } from 'react';
import { Container, Typography, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import MyAppBar from '../../components/AppBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import BodyBox from '../../components/BodyBox';
import ForumsOrderAdmin from '../../components/ForumsOrderAdmin';
import CreateForumAdmin from '../../components/CreateForumAdmin';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [forums, setForums] = useState([]);
  const router = useRouter();
  const auth = getAuth();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    const checkAdmin = async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().admin) {
          setIsAdmin(true);
          fetchForums(); // Fetch forums when user is an admin
        }
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkAdmin(user);
      } else {
        setIsAdmin(false);
        router.push('/');
      }
    });
  }, [auth, router]);

  const fetchForums = async () => {
    try {
      const forumsCollection = collection(db, 'forums');
      const forumsSnapshot = await getDocs(forumsCollection);
      const forumsList = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      forumsList.sort((a, b) => a.orderIdx - b.orderIdx);
      setForums(forumsList);
    } catch (error) {
      console.error('Error fetching forums:', error);
    }
  };

  const handleFetchForums = (newForums) => {
    setForums(newForums);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <MyAppBar />
        <BodyBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="calc(100vh - 64px)"
          textAlign="center"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          {isAdmin ? (
            <>
              <Typography variant="h4" gutterBottom>
                Admin Panel
              </Typography>
              {alertMessage && (
                <Alert severity={alertSeverity} sx={{ marginBottom: theme.spacing(2) }}>
                  {alertMessage}
                </Alert>
              )}
              <CreateForumAdmin 
                forums={forums} 
                onForumAdded={fetchForums} 
                setAlertMessage={setAlertMessage} 
                setAlertSeverity={setAlertSeverity} 
              />
              <ForumsOrderAdmin 
                forums={forums} 
                onFetchForums={fetchForums} 
                setAlertMessage={setAlertMessage} 
                setAlertSeverity={setAlertSeverity} 
              />
            </>
          ) : (
            <Typography variant="h6">Access Denied</Typography>
          )}
        </BodyBox>
      </Container>
    </ThemeProvider>
  );
};

export default AdminPage;
