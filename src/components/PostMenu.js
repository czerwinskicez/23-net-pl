import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const PostMenu = ({ postId, isAdmin, handleCopyLink, handleDeletePost }) => {
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

  const handleReportPost = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await addDoc(collection(db, 'reported_posts'), {
          postId,
          reportedAt: new Date(),
          reportedBy: user.uid,
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
      <IconButton onClick={handleMenuOpen}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleCopyLink(postId)}>Copy Link</MenuItem>
        <MenuItem onClick={handleReportPost}>Report Post</MenuItem>
        {isAdmin && <MenuItem onClick={() => handleDeletePost(postId)}>Delete Post</MenuItem>}
      </Menu>
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

export default PostMenu;
