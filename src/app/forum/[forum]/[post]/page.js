"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, ThemeProvider, Typography, CircularProgress, Button, TextField, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { auth, db, onAuthStateChanged } from '../../../../firebaseConfig';
import { doc, getDoc, addDoc, collection, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
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
  const [newPostContent, setNewPostContent] = useState('');
  const [creatingPost, setCreatingPost] = useState(false);
  const [posts, setPosts] = useState([]);

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsQuery = query(collection(db, `forums/${forum}/posts`), orderBy('createdAt', 'asc'));
        const querySnapshot = await getDocs(postsQuery);
        const postsList = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
          const postData = docSnapshot.data();
          const userDoc = await getDoc(doc(db, `users/${postData.creator}`));
          const userPhotoURL = userDoc.exists() ? userDoc.data().photoURL : null;
          return { id: docSnapshot.id, ...postData, userPhotoURL };
        }));
        setPosts(postsList);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [forum]);

  const handleCreatePost = async () => {
    setCreatingPost(true);
    try {
      await addDoc(collection(db, `forums/${forum}/posts`), {
        content: newPostContent,
        createdAt: serverTimestamp(),
        creator: auth.currentUser.uid,
      });
      setNewPostContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setCreatingPost(false);
    }
  };

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
          <List>
            {posts.map((post) => (
              <ListItem key={post.id} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar src={post.userPhotoURL} />
                </ListItemAvatar>
                <ListItemText
                  primary={post.content}
                  secondary={`Created by: ${post.creator} on ${new Date(post.createdAt.seconds * 1000).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
          <Box mt={4}>
            <TextField
              label="Create Post"
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreatePost}
              disabled={creatingPost}
              sx={{ mt: 2 }}
            >
              {creatingPost ? 'Posting...' : 'Create Post'}
            </Button>
          </Box>
        </BodyBox>
      </Container>
    </ThemeProvider>
  );
};

export default PostPage;
