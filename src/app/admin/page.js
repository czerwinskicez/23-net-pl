"use client";

import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import MyAppBar from '../../components/AppBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminPage = () => {
  const [forums, setForums] = useState([]);
  const [newForumName, setNewForumName] = useState('');
  const [newForumDescription, setNewForumDescription] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    const checkAdmin = async (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().admin) {
          setIsAdmin(true);
        }
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        checkAdmin(user);
      } else {
        setIsAdmin(false);
        router.push('/');
      }
    });
  }, [auth, router]);

  const fetchForums = async () => {
    const forumsCollection = collection(db, 'forums');
    const forumsSnapshot = await getDocs(forumsCollection);
    const forumsList = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setForums(forumsList);
  };

  useEffect(() => {
    fetchForums();
  }, []);

  const handleAddForum = async () => {
    if (newForumName && newForumDescription) {
      await addDoc(collection(db, 'forums'), {
        name: newForumName,
        description: newForumDescription,
      });
      setNewForumName('');
      setNewForumDescription('');
      setError('');
      fetchForums();
    } else {
      setError('Both name and description are required.');
    }
  };

  const handleDeleteForum = async (id) => {
    await deleteDoc(doc(db, 'forums', id));
    fetchForums();
  };

  if (!isAdmin) {
    return <Typography variant="h6">Access Denied</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <MyAppBar />
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          textAlign="center"
          sx={{ backgroundColor: theme.palette.background.default }}
        >
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>
          {error && <Alert severity="error" sx={{ marginBottom: theme.spacing(2) }}>{error}</Alert>}
          <Box sx={{ marginBottom: theme.spacing(2), width: '90%' }}>
            <TextField
              label="Forum Name"
              value={newForumName}
              onChange={(e) => setNewForumName(e.target.value)}
              fullWidth
              sx={{ marginBottom: theme.spacing(1) }}
            />
            <TextField
              label="Forum Description"
              value={newForumDescription}
              onChange={(e) => setNewForumDescription(e.target.value)}
              fullWidth
              sx={{ marginBottom: theme.spacing(2) }}
            />
            <Button variant="contained" color="primary" onClick={handleAddForum} fullWidth>
              Add Forum
            </Button>
          </Box>
          <List sx={{ width: '90%' }}>
            {forums.map(forum => (
              <ListItem key={forum.id} sx={{ backgroundColor: theme.palette.background.paper, marginBottom: theme.spacing(1), borderRadius: theme.shape.borderRadius }}>
                <ListItemText primary={forum.name} secondary={forum.description} sx={{ color: theme.palette.primary.main }} />
                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteForum(forum.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AdminPage;
