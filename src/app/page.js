// src/app/page.js
"use client";

import React, { useState, useEffect } from 'react';
import { Paper, Container, Box, Button, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  auth,
  provider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup
} from '../firebaseConfig';

// import { useTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import BodyBox from '../components/BodyBox';
import ForumDescription from '@/components/ForumDescription';

export default function Home() {
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
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
        // Call the Cloud Function to store user info
        const user = result.user;
        storeUserInfo(user);
        router.push('/start');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handlePasswordLogin = () => {
    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Call the Cloud Function to store user info
        const user = userCredential.user;
        storeUserInfo(user);
        router.push('/start');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Function to call the Cloud Function
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


  const handleRegister = () => {
    if (!validateEmail(email)) {
      setError('Invalid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push('/start');
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleClickOpen = (isRegister) => {
    setIsRegister(isRegister);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
          <ForumDescription/>
        </BodyBox>



        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isRegister ? 'Register' : 'Login'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {isRegister && (
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={isRegister ? handleRegister : handlePasswordLogin} color="primary">
              {isRegister ? 'Register' : 'Login'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
}
