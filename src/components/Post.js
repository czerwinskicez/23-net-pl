import React, { useState } from 'react';
import { ListItem, ListItemText, Divider, Menu, MenuItem, IconButton, Typography, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const Post = ({ post, forum, threadId, isAdmin, fetchPosts, userNames, handleCopyLink, handleDeletePost }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleReportPost = async (postId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await addDoc(collection(db, 'reported_posts'), {
          postId,
          reportedAt: new Date(),
          reportedBy: user.uid, // Save the user ID of the currently logged-in user
        });
        setSnackbarMessage('Post reported successfully.');
        setSnackbarSeverity('success');
      } catch (error) {
        console.error('Error reporting post:', error);
        setSnackbarMessage('Error reporting post.');
        setSnackbarSeverity('error');
      }
    } else {
      console.error('No user is currently logged in.');
      setSnackbarMessage('No user is currently logged in.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    handleMenuClose();
  };

  return (
    <>
      <ListItem alignItems="flex-start" id={post.id}>
        <ListItemText
          primary={post.description}
          secondary={
            <span style={{ marginTop: '8px', display: 'block' }}>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
                style={{ display: 'inline', marginRight: '10px' }}
              >
                {userNames[post.creatorId] || 'Unknown User'}
              </Typography>
              <Typography
                component="span"
                variant="body2"
                color="textSecondary"
                style={{ display: 'inline' }}
              >
                {new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </Typography>
            </span>
          }
        />
        <IconButton onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleCopyLink(post.id)}>Copy Link</MenuItem>
          <MenuItem onClick={() => handleReportPost(post.id)}>Report Post</MenuItem>
          {isAdmin && <MenuItem onClick={() => handleDeletePost(post.id)}>Delete Post</MenuItem>}
        </Menu>
      </ListItem>
      <Divider component="li" />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Post;
