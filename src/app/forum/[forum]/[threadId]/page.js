"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, ThemeProvider, Typography, Snackbar } from '@mui/material';
import { doc, getDoc, collection, getDocs, orderBy, query, deleteDoc, setDoc } from 'firebase/firestore';
import { db, auth, requestPermissionAndGetToken } from '../../../../firebaseConfig'; 
import BodyBox from '../../../../components/BodyBox';
import theme from '../../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import CreatePost from '../../../../components/CreatePost';
import PostsList from '../../../../components/PostsList';
import CustomBreadcrumbs from '../../../../components/CustomBreadcrumbs';
import ThreadHead from '../../../../components/ThreadHead';

const ThreadPage = ({ params }) => {
  const { forum, threadId } = params;
  const router = useRouter();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [forumData, setForumData] = useState(null);
  const [threadData, setThreadData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleUnsubscribe = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, `forums/${forum}/threads/${threadId}/users_to_notify/${userId}`);
      await deleteDoc(userDocRef);
      setIsSubscribed(false);
      setSnackbarMessage('You have successfully unsubscribed from this thread.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error unsubscribing from thread:', error);
      setSnackbarMessage('Error unsubscribing from this thread.');
      setSnackbarOpen(true);
    }
  };

  const handleSubscribe = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, `forums/${forum}/threads/${threadId}/users_to_notify/${userId}`);
      setIsSubscribed(true);
      setSnackbarMessage('You have successfully subscribed to this thread.');
      setSnackbarOpen(true);

      // Request FCM token for the subscribed user
      const fcmToken = await requestPermissionAndGetToken();
      if (fcmToken) {
        setDoc(userDocRef, { fcmToken });
      }
    } catch (error) {
      console.error('Error subscribing to thread:', error);
      setSnackbarMessage('Error subscribing to this thread.');
      setSnackbarOpen(true);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, `forums/${forum}/threads/${threadId}/users_to_notify/${userId}`);
      const userDoc = await getDoc(userDocRef);
      setIsSubscribed(userDoc.exists());
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const fetchForumData = async () => {
    try {
      const forumDocRef = doc(db, `forums/${forum}`);
      const forumDoc = await getDoc(forumDocRef);
      if (forumDoc.exists()) {
        setForumData(forumDoc.data());
      } else {
        setErrorMessage('No such forum!');
      }
    } catch (error) {
      setErrorMessage('Error fetching forum data.');
      console.error('Error fetching forum data:', error);
    }
  };

  const fetchThreadData = async () => {
    try {
      const threadDocRef = doc(db, `forums/${forum}/threads/${threadId}`);
      const threadDoc = await getDoc(threadDocRef);
      if (threadDoc.exists()) {
        setThreadData(threadDoc.data());
      } else {
        setErrorMessage('No such thread!');
      }
    } catch (error) {
      setErrorMessage('Error fetching thread data.');
      console.error('Error fetching thread data:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const postsQuery = query(collection(db, `forums/${forum}/threads/${threadId}/posts`), orderBy('createdAt', 'asc'));
      const postsSnapshot = await getDocs(postsQuery);
      const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsList);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  }, []);

  useEffect(() => {
    fetchForumData();
    fetchThreadData();
    fetchPosts();
    checkSubscriptionStatus();
  }, [forum, threadId]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <BodyBox>
          {errorMessage ? (
            <Typography variant="h6" color="error">
              {errorMessage}
            </Typography>
          ) : (
            forumData && threadData && (
              <>
                <CustomBreadcrumbs
                  links={[
                    { label: 'Start', href: '/start' },
                    { label: forumData.name, href: `/forum/${forum}` }
                  ]}
                  current={threadData.title}
                />
                <ThreadHead
                  threadData={threadData}
                  isSubscribed={isSubscribed}
                  handleSubscribe={handleSubscribe}
                  handleUnsubscribe={handleUnsubscribe}
                />
                <PostsList forum={forum} threadId={threadId} posts={posts} fetchPosts={fetchPosts} />
                <CreatePost forum={forum} threadId={threadId} fetchPosts={fetchPosts} />
              </>
            )
          )}
        </BodyBox>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </ThemeProvider>
  );
};

export default ThreadPage;
