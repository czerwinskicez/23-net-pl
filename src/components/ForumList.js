import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Make sure to import your Firestore config
import { useTheme } from '@mui/material/styles'; // Import useTheme
import { useRouter } from 'next/navigation'; // Import useRouter

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const theme = useTheme(); // Access the theme
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsCollection = collection(db, 'forums');
        const forumsSnapshot = await getDocs(forumsCollection);
        const forumsList = forumsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort forums by orderIdx
        forumsList.sort((a, b) => a.orderIdx - b.orderIdx);
        
        setForums(forumsList);
      } catch (err) {
        console.error('Failed to fetch forums:', err);
      }
    };

    fetchForums();
  }, []);

  const handleNavigation = (pathname) => {
    router.push(`/forum/${pathname}`); // Navigate to the forum's pathname
  };

  return (
    <Box sx={{ padding: theme.spacing(2), width: '90%' }}> {/* Set width to 90% */}
      <Typography variant="h4" gutterBottom>
        Available Forums
      </Typography>
      <List>
        {forums.map(forum => (
          <ListItem 
            key={forum.id} 
            button // Make ListItem clickable
            onClick={() => handleNavigation(forum.pathname)} // Handle navigation on click
            sx={{ 
              backgroundColor: theme.palette.background.paper, 
              marginBottom: theme.spacing(1), 
              borderRadius: theme.shape.borderRadius, 
              textDecoration: 'none', // Remove underline from links
              cursor: 'pointer' // Set cursor to pointer
            }}
          >
            <ListItemText 
              primary={forum.name} 
              secondary={forum.description} 
              sx={{ color: theme.palette.primary.main }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ForumList;
