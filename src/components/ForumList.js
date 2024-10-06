import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Chip, CircularProgress } from '@mui/material';
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
    <Box sx={{ padding: theme.spacing(2), width: '95%' }}> {/* Set width to 95% */}
      <Typography variant="h4" gutterBottom>
        Available Forums
      </Typography>
      <List>
        {forums.map(forum => (
          <ListItem 
            key={forum.id} 
            button
            onClick={() => handleNavigation(forum.pathname)}
            sx={{
              backgroundColor: theme.palette.background.paper,
              marginBottom: theme.spacing(1),
              borderRadius: theme.shape.borderRadius,
              boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4)', // Subtle outline
              transition: 'box-shadow 0.3s ease, transform 0.2s ease', // Smooth transition for hover effects
              '&:hover': {
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)', // More pronounced shadow on hover
                transform: 'scale(1.02)', // Slight scaling effect
                backgroundColor: theme.palette.background.paper,
              },
              cursor: 'pointer', // Pointer cursor on hover
              position: 'relative',
            }}
          >
            <ListItemText 
              primary={forum.name} 
              secondary={forum.description} 
              sx={{ color: theme.palette.primary.main }} 
            />
            <Chip 
              label={forum.threadCount+" thread(s)"} 
              size="small" 
              sx={{
                position: 'absolute',
                top: theme.spacing(1),
                right: theme.spacing(1),
                backgroundColor: theme.palette.common.white,
                color: theme.palette.primary.main, // Set text color to white for contrast
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ForumList;
