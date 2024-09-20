// src/app/start/page.js
"use client";

import React, { useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { auth, onAuthStateChanged } from '../../firebaseConfig';
import MyAppBar from '../../components/AppBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme'; // Import the theme
import ForumList from '../../components/ForumList'; // Import the ForumList component

export default function Start() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <MyAppBar />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          textAlign="center"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <ForumList /> {/* Use the ForumList component */}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
