import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Divider, Button, Chip, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import ArchiveIcon from '@mui/icons-material/Archive';

const ReportsAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [groupedReports, setGroupedReports] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  useEffect(() => {
    const fetchReportedPosts = async () => {
      try {
        const reportsCollection = collection(db, 'reported_posts');
        const reportsSnapshot = await getDocs(reportsCollection);
        const reportsList = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Grouping reports by postId
        const grouped = reportsList.reduce((acc, report) => {
          const { postId } = report;
          if (!acc[postId]) {
            acc[postId] = [];
          }
          acc[postId].push(report);
          return acc;
        }, {});

        setGroupedReports(grouped);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reported posts:', error);
        setLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  const archiveReports = async (postId, reports) => {
    try {
      // Prepare the archive data
      const archiveData = {
        archivedDate: Timestamp.now(),
        reports: reports.map(report => ({
          reportId: report.id,
          reportedBy: report.reportedBy,
          reportedAt: report.reportedAt
        }))
      };

      // Create a new document in the reported_posts_archive collection
      const archiveRef = doc(collection(db, 'reported_posts_archive'));
      await setDoc(archiveRef, archiveData);

      // Delete all reports from reported_posts
      const deletePromises = reports.map(report => {
        const reportRef = doc(db, 'reported_posts', report.id);
        return deleteDoc(reportRef);
      });
      await Promise.all(deletePromises);

      // Update local state to remove the archived reports
      setGroupedReports(prevGroupedReports => {
        const updatedReports = { ...prevGroupedReports };
        delete updatedReports[postId];
        return updatedReports;
      });
    } catch (error) {
      console.error('Error archiving reports:', error);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setSelectedUser(userDoc.data());
        setUserModalOpen(true);
      } else {
        console.error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const closeModal = () => {
    setUserModalOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <>
      {Object.entries(groupedReports).map(([postId, reports]) => (
        <div key={postId} style={{ textAlign: 'left', marginBottom: '2em' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              {postId}
            </Typography>
            <Chip
              label={`${reports.length} report(s)`}
              variant="outlined"
              color="secondary"
            />
          </Box>

          {reports.map((report, index) => (
            <div key={report.id} style={{ marginBottom: '1em' }}>
              <Typography>
                By: <Button onClick={() => fetchUserDetails(report.reportedBy)}>{report.reportedBy}</Button>
                Date: {new Date(report.reportedAt.seconds * 1000).toLocaleString()}
              </Typography>
            </div>
          ))}

          <Box justifyContent="right" display="flex">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<ArchiveIcon />}
              onClick={() => archiveReports(postId, reports)}
              sx={{ marginTop: '1em' }}
            >
              Archive
            </Button>
          </Box>

          <Divider sx={{ marginY: '2em' }} />
        </div>
      ))}

      <Dialog open={userModalOpen} onClose={closeModal}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Display Name: {selectedUser.displayName || 'N/A'}</Typography>
            </>
          ) : (
            <Typography>No user details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportsAdmin;
