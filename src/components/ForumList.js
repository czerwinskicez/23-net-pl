import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Badge, CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Make sure to import your Firestore config
import { useTheme } from '@mui/material/styles'; // Import useTheme
import { useRouter } from 'next/navigation'; // Import useRouter

const ForumList = () => {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const theme = useTheme(); // Access the theme
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const forumsCollection = collection(db, 'forums');
        const forumsSnapshot = await getDocs(forumsCollection);
        const forumsList = await Promise.all(forumsSnapshot.docs.map(async (doc) => {
          const forumData = doc.data();
          const threadsCollection = collection(db, `forums/${doc.id}/threads`);
          const threadsSnapshot = await getDocs(threadsCollection);
          return { id: doc.id, ...forumData, threadCount: threadsSnapshot.size };
        }));
        
        // Sort forums by orderIdx
        forumsList.sort((a, b) => a.orderIdx - b.orderIdx);
        
        setForums(forumsList);
      } catch (err) {
        console.error('Failed to fetch forums:', err);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchForums();
  }, []);

  const handleNavigation = (pathname) => {
    router.push(`/forum/${pathname}`); // Navigate to the forum's pathname
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    ); // Display CircularProgress while loading
  }

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
              cursor: 'pointer', // Set cursor to pointer
              position: 'relative' // Ensure the badge is positioned correctly
            }}
          >
            <ListItemText 
              primary={forum.name} 
              secondary={forum.description} 
              sx={{ color: theme.palette.primary.main }} 
            />
            <Badge 
              badgeContent={forum.threadCount} 
              sx={{ 
                position: 'absolute', 
                top: theme.spacing(2), 
                right: theme.spacing(2), 
                backgroundColor: 'transparent', 
                color: theme.palette.primary.main, 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ForumList;
