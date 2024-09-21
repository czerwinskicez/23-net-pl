import React, { useState } from 'react';
import { TextField, Button, Paper, Typography } from '@mui/material';
import { auth, db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const CreatePost = ({ forum, threadId, fetchPosts }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddPost = async () => {
    if (newPostContent.trim() === '') {
      setErrorMessage('Post content cannot be empty.');
      return;
    }

    try {
      const newPost = {
        creatorId: auth.currentUser.uid, // Store user ID instead of display name
        description: newPostContent,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, `forums/${forum}/threads/${threadId}/posts`), newPost);
      setNewPostContent('');
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      setErrorMessage('Error adding post.');
      console.error('Error adding post:', error);
    }
  };

  return (
    <Paper style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h6">Add a new post</Typography>
      <TextField
        label="New Post"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <Button variant="contained" color="primary" onClick={handleAddPost}>
        Add Post
      </Button>
      {errorMessage && (
        <Typography variant="body2" color="error">
          {errorMessage}
        </Typography>
      )}
    </Paper>
  );
};

export default CreatePost;
