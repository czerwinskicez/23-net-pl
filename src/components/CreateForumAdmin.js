import React, { useState } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import theme from '../app/theme';

const CreateForumAdmin = ({ forums, onForumAdded, setAlertMessage, setAlertSeverity }) => {
  const [newForumName, setNewForumName] = useState('');
  const [newForumDescription, setNewForumDescription] = useState('');
  const [newForumPathname, setNewForumPathname] = useState('');
  const [error, setError] = useState('');

  const handleAddForum = async () => {
    const pathnameRegex = /^[a-z0-9-_]+$/;
  
    if (!newForumName || !newForumDescription || !newForumPathname) {
      setError('All fields are required.');
      return;
    }
  
    if (!pathnameRegex.test(newForumPathname)) {
      setError('Pathname can only contain lowercase letters, numbers, hyphens, and underscores.');
      return;
    }
  
    try {
      const forumDocRef = doc(db, 'forums', newForumPathname);
      await setDoc(forumDocRef, {
        name: newForumName,
        description: newForumDescription,
        pathname: newForumPathname,
        orderIdx: forums ? forums.length : 0
      });
  
      setNewForumName('');
      setNewForumDescription('');
      setNewForumPathname('');
      setError('');
  
      onForumAdded(); // Call the function to fetch forums
      setAlertMessage('Forum added successfully!');
      setAlertSeverity('success');
  
      // Refresh the page
      window.location.reload();
    } catch (error) {
      setError('Error adding forum. Please try again.');
      setAlertMessage('Error adding forum. Please try again.');
      setAlertSeverity('error');
      console.error('Error adding forum:', error);
    }
  };
  

  return (
    <Box sx={{ marginBottom: theme.spacing(2), width: '90%' }}>
      {error && <Alert severity="error" sx={{ marginBottom: theme.spacing(2) }}>{error}</Alert>}
      <TextField
        label="Forum Name"
        value={newForumName}
        onChange={(e) => setNewForumName(e.target.value)}
        fullWidth
        sx={{ marginBottom: theme.spacing(1) }}
      />
      <TextField
        label="Pathname"
        value={newForumPathname}
        onChange={(e) => setNewForumPathname(e.target.value)}
        fullWidth
        sx={{ marginBottom: theme.spacing(1) }}
      />
      <TextField
        label="Forum Description"
        value={newForumDescription}
        onChange={(e) => setNewForumDescription(e.target.value)}
        fullWidth
        multiline rows="3"
        sx={{ marginBottom: theme.spacing(2) }}
      />
      <Button variant="contained" color="primary" onClick={handleAddForum} fullWidth>
        Add Forum
      </Button>
    </Box>
  );
};

export default CreateForumAdmin;
