import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const CreateForumDialog = ({ open, onClose, onCreate }) => {
  const [forumName, setForumName] = useState('');
  const [forumDescription, setForumDescription] = useState('');

  const handleCreate = () => {
    onCreate(forumName, forumDescription);
    setForumName('');
    setForumDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Forum</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Forum Name"
          fullWidth
          value={forumName}
          onChange={(e) => setForumName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Forum Description"
          fullWidth
          value={forumDescription}
          onChange={(e) => setForumDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleCreate} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateForumDialog;
