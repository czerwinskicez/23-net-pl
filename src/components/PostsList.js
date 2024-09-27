import React, { useState, useEffect } from 'react';
import { List, Typography, Snackbar, Paper } from '@mui/material';
import { db, auth, getDoc, doc, deleteDoc } from '../firebaseConfig';
import Post from './Post';

const PostsList = ({ forum, threadId, posts, fetchPosts }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userNames, setUserNames] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const userDoc = await getDoc(doc(db, `public_users/${auth.currentUser.uid}`));
      if (userDoc.exists() && userDoc.data().admin) {
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, []);

  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = posts.map(post => post.creatorId);
      const uniqueUserIds = [...new Set(userIds)];
      const userNamesTemp = {};

      for (const userId of uniqueUserIds) {
        const userDoc = await getDoc(doc(db, `public_users/${userId}`));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userNamesTemp[userId] = {
            displayName: userData.displayName,
            photoURL: userData.photoURL || null,
          };
        }
      }

      setUserNames(userNamesTemp);
    };

    fetchUserNames();
  }, [posts]);

  const handleCopyLink = (postId) => {
    const postUrl = `${window.location.origin}/forum/${forum}/${threadId}#${postId}`;
    if(typeof window != 'undefined') navigator.clipboard.writeText(postUrl).then(() => {
      setSnackbarOpen(true);
    });
  };

  const handleDeletePost = async (postId) => {
    try {
      await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${postId}`));
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Paper style={{ width: '95%', padding: '16px', marginBottom: '16px' }}>
        {posts.length > 0 ? (
          <List>
            {posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                forum={forum}
                threadId={threadId}
                isAdmin={isAdmin}
                fetchPosts={fetchPosts}
                userNames={userNames}
                handleCopyLink={handleCopyLink}
                handleDeletePost={handleDeletePost}
              />
            ))}
          </List>
        ) : (
          <Typography variant="body1">There are no posts yet.</Typography>
        )}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="Link copied to clipboard!"
      />
    </>
  );
};

export default PostsList;
