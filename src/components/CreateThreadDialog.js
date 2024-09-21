import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert } from '@mui/material';
import { doc, getDoc, runTransaction, collection } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig'; // Your Firebase configuration

const CreateThreadDialog = ({ open, handleClose, fetchThreads, forum }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const generateUUID = () => {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  };

  const handleCreateThread = async () => {
    if (!title.trim() || !description.trim()) {
      setDialogError('Title and description cannot be empty.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const displayName = userDoc.exists() ? userDoc.data().displayName : auth.currentUser.email;

      await runTransaction(db, async (transaction) => {
        const threadRef = doc(collection(db, `forums/${forum}/threads`));
        const newThread = {
          title,
          description,
          createdAt: new Date(),
          lastPostTimestamp: new Date(),
          creator: displayName,
          creatorUid: auth.currentUser.uid,
          uuid: generateUUID(),
        };
        transaction.set(threadRef, newThread);

        const firstPostRef = doc(collection(threadRef, 'posts'));
        const firstPost = {
          title,
          description,
          createdAt: new Date(),
          creator: displayName,
          creatorUid: auth.currentUser.uid,
        };
        transaction.set(firstPostRef, firstPost);
      });

      setSuccessMessage('Thread created successfully!');
      setTimeout(() => {
        handleClose();
        setTitle('');
        setDescription('');
        setSuccessMessage('');
        fetchThreads(); // Refresh the threads list
      }, 5000);
    } catch (error) {
      console.error('Error creating thread:', error);
      setDialogError('Error creating thread. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a new thread</DialogTitle>
      <DialogContent>
        {dialogError && <Alert severity="error">{dialogError}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateThread} color="primary">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateThreadDialog;
