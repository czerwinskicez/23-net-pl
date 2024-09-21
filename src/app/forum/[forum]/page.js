"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, ThemeProvider, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { auth, db, onAuthStateChanged } from '../../../firebaseConfig';
import { doc, getDoc, collection, addDoc, query, getDocs, orderBy, deleteDoc, runTransaction } from 'firebase/firestore';
import MyAppBar from '../../../components/AppBar';
import BodyBox from '../../../components/BodyBox';
import theme from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';

const ForumPage = ({ params }) => {
  const { forum } = params;
  const router = useRouter();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [forumData, setForumData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [threads, setThreads] = useState([]);
  const [dialogError, setDialogError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
      } else {
        const userDocRef = doc(db, 'public_users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().admin) {
          setIsAdmin(true);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchForumData = async () => {
      try {
        const forumDocRef = doc(db, 'forums', forum);
        const forumDoc = await getDoc(forumDocRef);
        if (forumDoc.exists()) {
          setForumData(forumDoc.data());
        } else {
          setErrorMessage('No such document!');
        }
      } catch (error) {
        setErrorMessage('Error fetching forum data.');
        console.error('Error fetching forum data:', error);
      }
    };

    fetchForumData();
  }, [forum]);

  const fetchThreads = async () => {
    try {
      const threadsQuery = query(collection(db, `forums/${forum}/threads`), orderBy('lastPostTimestamp', 'desc'));
      const threadsSnapshot = await getDocs(threadsQuery);
      const threadsList = threadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setThreads(threadsList);
    } catch (error) {
      console.error('Error fetching threads:', error);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [forum]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDialogError('');
    setSuccessMessage('');
  };

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
        setOpen(false);
        setTitle('');
        setDescription('');
        setSuccessMessage('');
        fetchThreads(); // Refresh the threads list
        router.refresh(); // Refresh the page after 5 seconds
      }, 5000);
    } catch (error) {
      console.error('Error creating thread:', error);
      setDialogError('Error creating thread. Please try again.');
    }
  };

  const handleDeleteThread = async (threadId) => {
    try {
      await deleteDoc(doc(db, `forums/${forum}/threads`, threadId));
      fetchThreads(); // Refresh the threads list
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  const handleRowClick = (threadId) => {
    router.push(`/forum/${forum}/${threadId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <MyAppBar />
        <BodyBox>
          {errorMessage ? (
            <Typography variant="h6" color="error">
              {errorMessage}
            </Typography>
          ) : (
            forumData && (
              <>
                <Typography variant="h4">{forumData.name}</Typography>
                <Typography variant="body1">{forumData.description}</Typography>

                <Box display="flex" justifyContent="flex-end" sx={{ width: "90%", marginBottom: "10px" }}>
                  <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Create Thread
                  </Button>
                </Box>
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
                      multiline
                      rows="4"
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
                <TableContainer component={Paper} style={{ width: "90%" }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 700 }}>Thread Title</TableCell>
                        <TableCell style={{ fontWeight: 700 }}>Thread Creator</TableCell>
                        <TableCell style={{ fontWeight: 700 }}>Created Timestamp</TableCell>
                        <TableCell style={{ fontWeight: 700 }}>Last Post Timestamp</TableCell>
                        {isAdmin && <TableCell style={{ fontWeight: 700 }}>Actions</TableCell>}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {threads.map((thread) => (
                        <TableRow key={thread.id} onClick={() => handleRowClick(thread.id)} style={{ cursor: 'pointer', transition: "0.23s" }}
                          hover sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.8)'
                            }
                          }}>
                          <TableCell>{thread.title}</TableCell>
                          <TableCell>{thread.creator}</TableCell>
                          <TableCell>{new Date(thread.createdAt.seconds * 1000).toLocaleString()}</TableCell>
                          <TableCell>{new Date(thread.lastPostTimestamp.seconds * 1000).toLocaleString()}</TableCell>
                          {isAdmin && (
                            <TableCell>
                              <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteThread(thread.id); }} color="secondary">
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )
          )}
        </BodyBox>
      </Container>
    </ThemeProvider>
  );
};

export default ForumPage;
