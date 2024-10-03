import React, { useEffect, useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import theme from '../app/theme';

const ReportsAdmin = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch reported posts where archived is null or doesn't exist
        const reportsQuery = query(collection(db, 'reported_posts'), where('archived', '==', null));
        const reportsSnapshot = await getDocs(reportsQuery);

        const reportData = await Promise.all(reportsSnapshot.docs.map(async (reportDoc) => {
          const report = reportDoc.data();

          // Combine forumId, threadId retrieval logic from previous code
          const postPathParts = reportDoc.ref.path.split('/'); // Split path into segments
          const forumId = postPathParts[1]; // Extract forumId from path
          const threadId = postPathParts[3]; // Extract threadId from path

          // Existing logic for fetching post details
          const postDocRef = doc(db, `forums/${report.forumId}/threads/${report.threadId}/posts/${report.postId}`);
          const postDoc = await getDoc(postDocRef);

          if (!postDoc.exists()) {
            return null; // Post might have been deleted
          }

          const postData = postDoc.data();
          const userDocRef = doc(db, `users/${report.reportedBy}`);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.exists() ? userDoc.data() : { displayName: null, email: 'Unknown' };

          return {
            ...report,
            postDescription: postData.description,
            imageUrl: postData.imageUrl || null,
            userName: userData.displayName || 'Anonymous',
            userEmail: userData.email || 'No Email',
            forumId: forumId, // Add forumId from post path
            threadId: threadId, // Add threadId from post path
            reportedAt: report.reportedAt.toDate().toLocaleDateString(),
          };
        }));

        setReports(reportData.filter(Boolean)); // Filter out any null results
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to fetch reports.');
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>View Reported Posts</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <List>
            {reports.map((report, index) => (
              <ListItem key={index} sx={{ backgroundColor: theme.palette.background.paper, marginBottom: theme.spacing(1), borderRadius: theme.shape.borderRadius, padding: theme.spacing(2) }}>
                <ListItemText
                  primary={`Post in Forum: ${report.forumId}, Thread: ${report.threadId}`}
                  secondary={`Post Description: ${report.postDescription}\nReported At: ${report.reportedAt}\nReported By: ${report.userName} (${report.userEmail})`}
                />
                {report.imageUrl && (
                  <img src={report.imageUrl} alt="Post Image" style={{ width: '100px', height: 'auto' }} />
                )}
              </ListItem>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default ReportsAdmin;