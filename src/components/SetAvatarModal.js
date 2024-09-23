import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const SetAvatarModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (newFile) => {
    if (newFile && !newFile.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      setFile(null);
    } else if (newFile && newFile.size > 10 * 1024 * 1024) { // 10MB size limit
      setError('File size should be less than 10MB.');
      setFile(null);
    } else {
      setError('');
      setFile(newFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress if needed
      },
      (error) => {
        setError('Upload failed.');
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const userDoc = doc(db, 'public_users', auth.currentUser.uid);
          await updateDoc(userDoc, { photoURL: downloadURL });
          onSuccess(downloadURL);
          onClose();
        } catch (error) {
          setError('Failed to get download URL.');
          setUploading(false);
        }
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Change Avatar</DialogTitle>
      <DialogContent>
        <MuiFileInput
          value={file}
          onChange={handleFileChange}
          placeholder="Click here to select a file"
          accept="image/*"
        />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" variant="contained" disabled={uploading}>
          {uploading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SetAvatarModal;
