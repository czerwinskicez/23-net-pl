import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Divider, Menu, MenuItem, IconButton, Typography, Snackbar, Paper } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { db, auth, getDoc, doc } from '../firebaseConfig';
import { deleteDoc } from 'firebase/firestore';

const PostsList = ({ forum, threadId, posts, fetchPosts }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userNames, setUserNames] = useState({});

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
          userNamesTemp[userId] = userDoc.data().displayName;
        }
      }

      setUserNames(userNamesTemp);
    };

    fetchUserNames();
  }, [posts]);

  const handleMenuOpen = (event, postId) => {
    setAnchorEl(event.currentTarget);
    setSelectedPostId(postId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPostId(null);
  };

  const handleCopyLink = () => {
    const postUrl = `${window.location.origin}/forum/${forum}/${threadId}#${selectedPostId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      setSnackbarOpen(true);
    });
    handleMenuClose();
  };

  const handleDeletePost = async () => {
    try {
      await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${selectedPostId}`));
      fetchPosts(); // Refresh the posts list
      handleMenuClose();
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
      <Paper style={{ width: '90%', padding: '16px', marginBottom: '16px' }}>
        {posts.length > 0 ? (
          <List>
            {posts.map((post) => (
              <React.Fragment key={post.id}>
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
                  <IconButton onClick={(event) => handleMenuOpen(event, post.id)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleCopyLink}>Copy Link</MenuItem>
                    {isAdmin && <MenuItem onClick={handleDeletePost}>Delete Post</MenuItem>}
                  </Menu>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
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
