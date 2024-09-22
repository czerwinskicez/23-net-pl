import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore'; // Import doc
import { db } from '../firebaseConfig';

const ThreadsTable = ({ forum, handleRowClick, isAdmin }) => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const threadsQuery = query(collection(db, `forums/${forum}/threads`), orderBy('lastPostTimestamp', 'desc'));
        const threadsSnapshot = await getDocs(threadsQuery);
        const threadsList = await Promise.all(threadsSnapshot.docs.map(async (doc) => {
          const postsQuery = query(collection(db, `forums/${forum}/threads/${doc.id}/posts`));
          const postsSnapshot = await getDocs(postsQuery);
          return { id: doc.id, ...doc.data(), postCount: postsSnapshot.size };
        }));
        setThreads(threadsList);
      } catch (error) {
        console.error('Error fetching threads:', error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchThreads();
  }, [forum]);

  const handleDeleteThread = async (threadId) => {
    try {
      await deleteDoc(doc(db, `forums/${forum}/threads`, threadId));
      setThreads(threads.filter(thread => thread.id !== threadId)); // Update the state to remove the deleted thread
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} style={{ width: "90%" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 700 }}>Thread Title</TableCell>
            <TableCell style={{ fontWeight: 700 }}>Thread Creator</TableCell>
            <TableCell style={{ fontWeight: 700 }}>Created Timestamp</TableCell>
            <TableCell style={{ fontWeight: 700 }}>Number of Posts</TableCell> {/* Change header */}
            {isAdmin && <TableCell style={{ fontWeight: 700 }}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {threads.map((thread) => (
            <TableRow
              key={thread.id}
              onClick={() => handleRowClick(thread.id)}
              style={{ cursor: 'pointer', transition: "0.23s" }}
              hover
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.8)'
                }
              }}
            >
              <TableCell>{thread.title}</TableCell>
              <TableCell>{thread.creator}</TableCell>
              <TableCell>{new Date(thread.createdAt.seconds * 1000).toLocaleString()}</TableCell>
              <TableCell>{thread.postCount}</TableCell> {/* Display number of posts */}
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
  );
};

export default ThreadsTable;
