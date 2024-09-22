import React, { useState } from 'react';
import { ListItem, ListItemText, Divider, Menu, MenuItem, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Post = ({ post, forum, threadId, isAdmin, fetchPosts, userNames, handleCopyLink, handleDeletePost }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
          {isAdmin && <MenuItem onClick={() => handleDeletePost(post.id)}>Delete Post</MenuItem>}
        </Menu>
      </ListItem>
      <Divider component="li" />
    </>
  );
};

export default Post;
