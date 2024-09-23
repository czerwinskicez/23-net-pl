import React, { useState } from 'react';
import { Button, CircularProgress, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MuiFileInput } from 'mui-file-input';
import { storage } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ImageUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

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

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Handle progress
      },
      (error) => {
        setError('Upload failed.');
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUploadSuccess(downloadURL);
          setUploading(false);
          setOpen(false); // Close the modal on success
        }).catch((error) => {
          setError('Failed to get download URL.');
          setUploading(false);
        });
      }
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Upload Image
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Upload Image</DialogTitle>
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
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpload} color="primary" variant="contained" disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageUpload;
