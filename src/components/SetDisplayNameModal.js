import React, { useState } from 'react';
import { TextField, Button, Typography, Modal, Box } from '@mui/material';
import { auth, db } from '../firebaseConfig';
import { doc, serverTimestamp, collection, writeBatch } from 'firebase/firestore';

const SetDisplayNameModal = ({ isOpen, onClose, onSuccess }) => {
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDisplayName = async () => {
    if (displayName.trim() === '') {
      setErrorMessage('Display name cannot be empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const publicUserRef = doc(db, `public_users/${auth.currentUser.uid}`);
      const nameHistoryRef = collection(db, `public_users/${auth.currentUser.uid}/nameHistory`);

      const batch = writeBatch(db);

      batch.update(publicUserRef, { displayName });
      batch.set(doc(nameHistoryRef), { displayName, timestamp: serverTimestamp() });

      await batch.commit();

      setSuccessMessage('Display name updated successfully.');
      setErrorMessage('');
      setTimeout(() => {
        window.location.reload(); // Refresh the page after 1 second
      }, 1000);
      onSuccess(displayName);
    } catch (error) {
      setErrorMessage('Error saving display name.');
      setSuccessMessage('');
      console.error('Error saving display name:', error);
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSaveDisplayName();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          backgroundColor: 'white',
          padding: '16px',
          boxShadow: 24,
        }}
      >
        <Typography variant="h6">Set Display Name</Typography>
        <TextField
          label="Display Name"
          variant="outlined"
          fullWidth
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ marginBottom: '16px' }}
          disabled={isSubmitting}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveDisplayName}
            disabled={isSubmitting}
          >
            Save
          </Button>
        </Box>
        {errorMessage && (
          <Typography variant="body2" color="error" style={{ marginTop: '16px' }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="body2" color="primary" style={{ marginTop: '16px' }}>
            {successMessage}
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default SetDisplayNameModal;
