import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const RemoveForumDialog = ({ open, onClose, onRemove }) => {
  const [forumId, setForumId] = useState('');

  const handleRemove = () => {
    onRemove(forumId);
    setForumId('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Remove Forum</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Forum ID"
          fullWidth
          value={forumId}
          onChange={(e) => setForumId(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleRemove} color="secondary">Remove</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveForumDialog;
