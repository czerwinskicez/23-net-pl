import React, { useState } from 'react';
import { Paper, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ThreadHead = ({ threadData, isSubscribed, handleSubscribe, handleUnsubscribe }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper style={{ width: '95%', marginBottom: "16px", padding: "16px", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      {/* Left-aligned Thread Title and Description */}
      <div style={{ textAlign: 'left' }}>
        <Typography variant="h4">{threadData.title}</Typography>
        <Typography variant="body1">{threadData.description}</Typography>
      </div>
      {/* Collapsible Menu for Subscribe/Unsubscribe */}
      <div>
        <IconButton onClick={handleMenuClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {isSubscribed ? (
            <MenuItem onClick={handleUnsubscribe}>Unsubscribe from Thread</MenuItem>
          ) : (
            <MenuItem onClick={handleSubscribe}>Subscribe to Thread</MenuItem>
          )}
        </Menu>
      </div>
    </Paper>
  );
};

export default ThreadHead;
