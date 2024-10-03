"use client";

import React, { useState, useEffect } from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { auth, provider, signInWithPopup, onAuthStateChanged } from '../firebaseConfig';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import BodyBox from '../components/BodyBox';
import ForumDescription from '@/components/ForumDescription';
import AuthDialog from '@/components/AuthDialog'; // Import the new component

export default function Home() {
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/start');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSSOLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        storeUserInfo(user);
        router.push('/start');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleClickOpen = (isRegister) => {
    setIsRegister(isRegister);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const storeUserInfo = (user) => {
    const userDoc = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
    };

    return fetch('/storeUserInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDoc),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <BodyBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="100vh"
          textAlign="center"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <img src="/logo.png" alt="23net logo" style={{ marginBottom: '16px' }} />
          <Typography variant="h4" gutterBottom>
            Welcome to 23.net.pl Forum
          </Typography>
          <Box display="flex" flexDirection="column" width="100%" maxWidth="300px">
            <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleSSOLogin}>
              Login with SSO
            </Button>
            <Button variant="outlined" color="primary" sx={{ mb: 2 }} onClick={() => handleClickOpen(false)}>
              Login with Password
            </Button>
            <Button variant="text" color="primary" onClick={() => handleClickOpen(true)}>
              Register with Password
            </Button>
          </Box>
          <Typography style={{marginTop: "16px"}} color="secondary" sx={{fontSize: 16, opacity: 0.666}}>
            By logging in, you accept cookies necessary to handle session.
          </Typography>
          <ForumDescription />
        </BodyBox>

        <AuthDialog
          open={open}
          handleClose={handleClose}
          isRegister={isRegister}
        />
      </Container>
    </ThemeProvider>
  );
}
