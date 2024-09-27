import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, Checkbox, FormControlLabel } from '@mui/material';
import { auth, db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore'; // Added setDoc for users_to_notify
import SetDisplayNameModal from './SetDisplayNameModal';
import Send from '@mui/icons-material/Send';
import ImageUpload from './ImageUpload'; // Import the ImageUpload component

const CreatePost = ({ forum, threadId, fetchPosts }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(''); // State for image URL
  const [receiveNotifications, setReceiveNotifications] = useState(true); // State for notifications

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, `public_users/${auth.currentUser.uid}`));
      if (userDoc.exists()) {
        setDisplayName(userDoc.data().displayName || '');
      }
    };

    fetchUserData();
  }, []);

  const handleAddPost = async () => {
    if (newPostContent.trim() === '' && !imageUrl) {
      setErrorMessage('Post content or image cannot be empty.');
      return;
    }

    if (!displayName) {
      setIsModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const newPost = {
        creatorId: auth.currentUser.uid,
        description: newPostContent,
        imageUrl: imageUrl, // Include image URL in the post
        createdAt: serverTimestamp(),
        receiveNotifications: receiveNotifications, // Include notification preference
      };
      await addDoc(collection(db, `forums/${forum}/threads/${threadId}/posts`), newPost);

      // If user wants to receive notifications, add user ID to the users_to_notify collection
      if (receiveNotifications) {
        await setDoc(
          doc(db, `forums/${forum}/threads/${threadId}/users_to_notify`, auth.currentUser.uid),
          { uid: auth.currentUser.uid }
        );
      }

      window.location.reload(); // Refresh the page immediately after adding the post
    } catch (error) {
      setErrorMessage('Error adding post.');
      console.error('Error adding post:', error);
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSuccess = (newDisplayName) => {
    setDisplayName(newDisplayName);
    setIsModalOpen(false);
    handleAddPost(); // Proceed with adding the post
  };

  const getFileNameFromUrl = (url) => {
    return url.substring(url.lastIndexOf('/') + 1);
  };

  return (
    <>
      <Paper style={{ padding: '16px', marginTop: '16px', width: "95%" }}>
        <Typography variant="h6">Add a new post</Typography>
        {!displayName && (
          <Typography variant="body2" color="error" style={{ marginBottom: '16px' }}>
            You need to set a username before you can add a post. You can do that in the upper right dropdown menu.
          </Typography>
        )}
        <TextField
          label="New Post"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          style={{ marginBottom: '16px' }}
          disabled={!displayName || isSubmitting}
        />
        {imageUrl && (
          <Box display="flex" alignItems="center" style={{ marginBottom: '16px' }}>
            <img src={imageUrl} alt="Uploaded" style={{ height: '50px', marginRight: '8px' }} />
            <Typography variant="body2">{getFileNameFromUrl(imageUrl)}</Typography>
          </Box>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={receiveNotifications}
              onChange={(e) => setReceiveNotifications(e.target.checked)}
            />
          }
          label="I want to receive notifications from this thread"
          style={{ marginBottom: '16px' }}
        />
        <Box display="flex" justifyContent="flex-end" alignItems="center" gap={2}>
          <ImageUpload onUploadSuccess={(url) => setImageUrl(url)} /> {/* Include ImageUpload component */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPost}
            disabled={!displayName || isSubmitting}
            endIcon={<Send />}
          >
            Add Post
          </Button>
        </Box>
        {errorMessage && (
          <Typography variant="body2" color="error">
            {errorMessage}
          </Typography>
        )}
      </Paper>

      <SetDisplayNameModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};

export default CreatePost;
