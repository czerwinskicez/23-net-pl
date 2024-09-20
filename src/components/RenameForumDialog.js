import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const RenameForumDialog = ({ open, onClose, onRename }) => {
  const [forumId, setForumId] = useState('');
  const [newForumName, setNewForumName] = useState('');

  const handleRename = () => {
    onRename(forumId, newForumName);
    setForumId('');
    setNewForumName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rename Forum</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Forum ID"
          fullWidth
          value={forumId}
          onChange={(e) => setForumId(e.target.value)}
        />
        <TextField
          margin="dense"
          label="New Forum Name"
          fullWidth
          value={newForumName}
          onChange={(e) => setNewForumName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="default">Cancel</Button>
        <Button onClick={handleRename} color="default">Rename</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RenameForumDialog;
