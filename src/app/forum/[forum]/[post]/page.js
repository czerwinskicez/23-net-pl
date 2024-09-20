"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, ThemeProvider, Typography, CircularProgress } from '@mui/material';
import { auth, db, onAuthStateChanged } from '../../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import MyAppBar from '../../../../components/AppBar';
import BodyBox from '../../../../components/BodyBox';
import theme from '../../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const PostPage = ({ params }) => {
  const { forum, post } = params;
  const router = useRouter();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const postDocRef = doc(db, `forums/${forum}/posts`, post);
        const postDoc = await getDoc(postDocRef);
        if (postDoc.exists()) {
          setPostData(postDoc.data());
        } else {
          setErrorMessage('No such document!');
        }
      } catch (error) {
        setErrorMessage('Error fetching post data.');
        console.error('Error fetching post data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
  }, [forum, post]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
          <MyAppBar />
          <BodyBox>
            <CircularProgress />
          </BodyBox>
        </Container>
      </ThemeProvider>
    );
  }

  if (errorMessage) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
          <MyAppBar />
          <BodyBox>
            <Typography variant="h6" color="error">
              {errorMessage}
            </Typography>
          </BodyBox>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <MyAppBar />
        <BodyBox>
          {postData && (
            <>
              <Typography variant="h4">{postData.title}</Typography>
              <Typography variant="body1">{postData.description}</Typography>
              <Typography variant="body2">
                Created by: {postData.creator} on {new Date(postData.createdAt.seconds * 1000).toLocaleString()}
              </Typography>
              <Typography variant="body2">
                Last updated: {new Date(postData.lastPostTimestamp.seconds * 1000).toLocaleString()}
              </Typography>
            </>
          )}
        </BodyBox>
      </Container>
    </ThemeProvider>
  );
};

export default PostPage;
