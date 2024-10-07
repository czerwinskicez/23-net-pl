import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Divider, Snackbar, Alert, Avatar, IconButton } from '@mui/material';
import { ThumbUpAlt, ThumbUpOffAlt, ThumbDownAlt, ThumbDownOffAlt } from '@mui/icons-material';
import { doc, deleteDoc, getDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';
import PostMenu from './PostMenu';
import Thumbnail from './Thumbnail';

const Post = ({ post, forum, threadId, isAdmin, fetchPosts, userNames, handleCopyLink }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState(null); // "like", "dislike", or null

  const auth = getAuth();
  const user = auth.currentUser;

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeletePost = async (postId) => {
    if (user) {
      const userDoc = await getDoc(doc(db, 'public_users', user.uid));
      if (userDoc.exists() && userDoc.data().admin) {
        try {
          await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${postId}`));
          setSnackbarMessage('Post deleted successfully.');
          setSnackbarSeverity('success');
          fetchPosts(); // Refresh the posts list
        } catch (error) {
          console.error('Error deleting post:', error);
          setSnackbarMessage('Error deleting post.');
          setSnackbarSeverity('error');
        }
      } else {
        console.error('User is not an admin.');
        setSnackbarMessage('User is not an admin.');
        setSnackbarSeverity('error');
      }
    } else {
      console.error('No user is currently logged in.');
      setSnackbarMessage('No user is currently logged in.');
      setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
  };

  // Fetch likes, dislikes, and user reaction
  const fetchReactions = async () => {
    const likesSnapshot = await getDocs(collection(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/likes`));
    const dislikesSnapshot = await getDocs(collection(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/dislikes`));

    setLikes(likesSnapshot.size);
    setDislikes(dislikesSnapshot.size);

    if (user) {
      const userLikeDoc = await getDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/likes/${user.uid}`));
      const userDislikeDoc = await getDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/dislikes/${user.uid}`));

      if (userLikeDoc.exists()) {
        setUserReaction('like');
      } else if (userDislikeDoc.exists()) {
        setUserReaction('dislike');
      } else {
        setUserReaction(null);
      }
    }
  };

  useEffect(() => {
    fetchReactions();
  }, []);

  const handleLike = async () => {
    if (user) {
      if (userReaction === 'like') {
        // Remove like
        await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/likes/${user.uid}`));
        setUserReaction(null);
        setLikes(likes - 1);
      } else {
        // Add like and remove dislike if exists
        await setDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/likes/${user.uid}`), {});
        if (userReaction === 'dislike') {
          await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/dislikes/${user.uid}`));
          setDislikes(dislikes - 1);
        }
        setUserReaction('like');
        setLikes(likes + 1);
      }
    }
  };

  const handleDislike = async () => {
    if (user) {
      if (userReaction === 'dislike') {
        // Remove dislike
        await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/dislikes/${user.uid}`));
        setUserReaction(null);
        setDislikes(dislikes - 1);
      } else {
        // Add dislike and remove like if exists
        await setDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/dislikes/${user.uid}`), {});
        if (userReaction === 'like') {
          await deleteDoc(doc(db, `forums/${forum}/threads/${threadId}/posts/${post.id}/likes/${user.uid}`));
          setLikes(likes - 1);
        }
        setUserReaction('dislike');
        setDislikes(dislikes + 1);
      }
    }
  };

  const renderPost = (description) => {
    return description.split('\n').map((line, index) => {
      const isQuote = line.startsWith('>');
      const trimmedLine = line.trim();
      
      return (
        <Typography
          key={index}
          variant="body1"
          component="span"
          sx={{
            display: 'block',
            color: isQuote ? (theme) => theme.palette.quotation.main : 'inherit',
            fontStyle: "italic",
          }}
        >
          {trimmedLine.length === 0 ? '\u00A0' : line}
        </Typography>
      );
    });
  };

  return (
    <>
      <Card id={post.id} sx={{ marginBottom: 2, position: 'relative' }}>
        <CardContent sx={{ "&:last-child": {
          paddingBottom: "12px"
        }}}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                alt={userNames[post.creatorId]?.displayName || 'Unknown User'}
                src={userNames[post.creatorId]?.photoURL || ''}
                sx={{ marginRight: 1 }}
              />
              <Typography variant="h6" component="div" sx={{ marginRight: 1 }}>
                {userNames[post.creatorId]?.displayName || 'Unknown User'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(post.createdAt.seconds * 1000).toLocaleString()}
              </Typography>
            </Box>
            <PostMenu
              postId={post.id}
              isAdmin={isAdmin}
              handleCopyLink={handleCopyLink}
              handleDeletePost={handleDeletePost}
            />
          </Box>
          <Typography
            variant="body1"
            component="pre"
            sx={{ textAlign: 'left', marginTop: 2, whiteSpace: 'pre-wrap' }}
          >
            {renderPost(post.description)}
          </Typography>
          {post.imageUrl && (
            <Box sx={{ textAlign: 'left', marginTop: 2 }}>
              <img
                src={post.imageUrl}
                alt="Post Thumbnail"
                style={{ maxHeight: '123px', cursor: 'pointer' }}
                onClick={handleDialogOpen}
              />
            </Box>
          )}
          {/* Like/Dislike buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
            <IconButton onClick={handleLike}>
              {userReaction === 'like' ? <ThumbUpAlt /> : <ThumbUpOffAlt />}
            </IconButton>
            <Typography variant="body2" sx={{ marginRight: 2 }}>
              {likes}
            </Typography>
            <IconButton onClick={handleDislike}>
              {userReaction === 'dislike' ? <ThumbDownAlt /> : <ThumbDownOffAlt />}
            </IconButton>
            <Typography variant="body2">
              {dislikes}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Thumbnail imageUrl={post.imageUrl} open={dialogOpen} onClose={handleDialogClose} />
    </>
  );
};

export default Post;
