import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Divider, Snackbar, Alert } from '@mui/material';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import PostMenu from './PostMenu';
import Thumbnail from './Thumbnail';

const Post = ({ post, forum, threadId, isAdmin, fetchPosts, userNames, handleCopyLink }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeletePost = async (postId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().admin) {
        try {
          await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${postId}`));
          setSnackbarMessage('Post deleted successfully.');
          setSnackbarSeverity('success');
          fetchPosts(); // Refresh the posts list
        } catch (error) {
          console.error('Error deleting post:', error);
          setSnackbarMessage('Error deleting post.');
          setSnackbarSeverity('error');
        }
      } else {
        console.error('User is not an admin.');
        setSnackbarMessage('User is not an admin.');
        setSnackbarSeverity('error');
      }
    } else {
      console.error('No user is currently logged in.');
      setSnackbarMessage('No user is currently logged in.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  return (
    <>
      <Card id={post.id} sx={{ marginBottom: 2, position: 'relative' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="div" sx={{ marginRight: 1 }}>
                {userNames[post.creatorId] || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </Typography>
            </Box>
            <PostMenu
              postId={post.id}
              isAdmin={isAdmin}
              handleCopyLink={handleCopyLink}
              handleDeletePost={handleDeletePost}
            />
          </Box>
          <Typography
            variant="body1"
            component="pre"
            sx={{ textAlign: 'left', marginTop: 2, whiteSpace: 'pre-wrap' }}
          >
            {post.description}
          </Typography>
          {post.imageUrl && (
            <Box sx={{ textAlign: 'left', marginTop: 2 }}>
              <img
                src={post.imageUrl}
                alt="Post Thumbnail"
                style={{ maxHeight: '123px', cursor: 'pointer' }}
                onClick={handleDialogOpen}
              />
            </Box>
          )}
        </CardContent>
      </Card>
      <Divider />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Thumbnail imageUrl={post.imageUrl} open={dialogOpen} onClose={handleDialogClose} />
    </>
  );
};

export default Post;
