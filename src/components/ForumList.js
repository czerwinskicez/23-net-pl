// src/components/ForumList.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Make sure to import your Firestore config
import { useTheme } from '@mui/material/styles'; // Import useTheme

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const theme = useTheme(); // Access the theme

  useEffect(() => {
    const fetchForums = async () => {
      const forumsCollection = collection(db, 'forums');
      const forumsSnapshot = await getDocs(forumsCollection);
      const forumsList = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setForums(forumsList);
    };

    fetchForums();
  }, []);

  return (
    <Box sx={{ padding: theme.spacing(2) }}>
      <Typography variant="h4" gutterBottom>
        Available Forums
      </Typography>
      <List>
        {forums.map(forum => (
          <ListItem key={forum.id} sx={{ backgroundColor: theme.palette.background.paper, marginBottom: theme.spacing(1), borderRadius: theme.shape.borderRadius }}>
            <ListItemText primary={forum.name} secondary={forum.description} sx={{ color: theme.palette.primary.main }} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ForumList;
