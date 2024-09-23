"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, ThemeProvider, Typography, Button, Snackbar, Alert } from '@mui/material';
import { auth, db, onAuthStateChanged } from '../../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import BodyBox from '../../../components/BodyBox';
import theme from '../../theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import ThreadsTable from '../../../components/ThreadsTable';
import CreateThreadDialog from '../../../components/CreateThreadDialog';
import AddIcon from '@mui/icons-material/Add';
import CustomBreadcrumbs from '../../../components/CustomBreadcrumbs';

const ForumPage = ({ params }) => {
  const { forum } = params;
  const router = useRouter();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [forumData, setForumData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [open, setOpen] = useState(false);
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRowClick = (threadId) => {
    router.push(`/forum/${forum}/${threadId}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={isLargeScreen ? 'md' : 'sm'}>
        <BodyBox>
          {errorMessage ? (
            <Typography variant="h6" color="error">
              {errorMessage}
            </Typography>
          ) : (
            forumData && (
              <>
                <CustomBreadcrumbs
                  links={[
                    { label: 'Start', href: '/start' },
                  ]}
                  current={forumData.name}
                />

                <Box sx={{ width: "95%", marginBottom: "10px" }}>
                  <Typography variant="h4">{forumData.name}</Typography>
                  <Typography variant="body1">{forumData.description}</Typography>
                </Box>

                <Box display="flex" justifyContent="flex-end" sx={{ width: "95%", marginBottom: "10px" }}>
                  <Button variant="contained" color="primary" onClick={handleClickOpen} endIcon={<AddIcon />}>
                    Create Thread
                  </Button>
                </Box>
                <CreateThreadDialog
                  open={open}
                  handleClose={handleClose}
                  forum={forum}
                  fetchThreads={() => document.querySelector('ThreadsTable').fetchThreads()}
                />
                <ThreadsTable
                  forum={forum}
                  handleRowClick={handleRowClick}
                  isAdmin={isAdmin}
                />
              </>
            )
          )}
        </BodyBox>
      </Container>
    </ThemeProvider>
  );
};

export default ForumPage;
