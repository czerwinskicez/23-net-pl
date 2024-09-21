import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Alert, Typography } from '@mui/material';
import { doc, getDoc, runTransaction, collection } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const CreateThreadDialog = ({ open, handleClose, forum, fetchThreads }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, `public_users/${auth.currentUser.uid}`));
      if (userDoc.exists()) {
        setDisplayName(userDoc.data().displayName || '');
      }
    };

    fetchUserData();
  }, []);

  const generateUUID = () => {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16).toUpperCase();
    });
  };

  const handleCreateThread = async () => {
    if (!title.trim() || !description.trim()) {
      setDialogError('Title and description cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const userDocRef = doc(db, 'public_users', auth.currentUser.uid);
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
      });

      setSuccessMessage('Thread created successfully!');
      setTimeout(() => {
        window.location.reload(); // Refresh the page after 1 second
      }, 1000);
    } catch (error) {
      console.error('Error creating thread:', error);
      setDialogError('Error creating thread. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create a new thread</DialogTitle>
      <DialogContent>
        {dialogError && <Alert severity="error">{dialogError}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {!displayName && (
          <Typography variant="body2" color="error" style={{ marginBottom: '16px' }}>
            You need to set a username before you can create a thread. You can do that in the upper right dropdown menu.
          </Typography>
        )}
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!displayName || isSubmitting}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!displayName || isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateThread}
          disabled={!displayName || isSubmitting}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateThreadDialog;
