"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, ThemeProvider, Typography, Paper } from '@mui/material';
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import BodyBox from '../../../../components/BodyBox';
import theme from '../../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import CreatePost from '../../../../components/CreatePost';
import PostsList from '../../../../components/PostsList';
import CustomBreadcrumbs from '../../../../components/CustomBreadcrumbs';

const ThreadPage = ({ params }) => {
  const { forum, threadId } = params;
  const router = useRouter();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [threadData, setThreadData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

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
    fetchThreadData();
    fetchPosts();
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
            threadData && (
              <>
                <CustomBreadcrumbs
                  links={[
                    { label: 'Start', href: '/start' },
                    { label: forum, href: `/forum/${forum}` }
                  ]}
                  current={threadData.title}
                />

                <Paper style={{ width: '90%', marginBottom: "16px", padding: "16px" }}>
                  <Typography variant="h4">{threadData.title}</Typography>
                  <Typography variant="body1">{threadData.description}</Typography>
                </Paper>
                <PostsList forum={forum} threadId={threadId} posts={posts} fetchPosts={fetchPosts} />
                <CreatePost forum={forum} threadId={threadId} fetchPosts={fetchPosts} />
              </>
            )
          )}
        </BodyBox>
      </Container>
    </ThemeProvider>
  );
};

export default ThreadPage;
