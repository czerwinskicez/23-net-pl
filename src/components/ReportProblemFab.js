import React, { useState } from 'react';
import { Fab, Modal, TextField, Button, Typography, Box } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ReportProblemFab = () => {
  const [open, setOpen] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleReportSubmit = async () => {
    if (reportContent.trim() === '') {
      setErrorMessage('Report content cannot be empty.');
      return;
    }

    try {
      await addDoc(collection(db, 'report'), {
        content: reportContent,
        createdAt: serverTimestamp(),
      });
      setReportContent('');
      setErrorMessage('');
      handleClose();
    } catch (error) {
      setErrorMessage('Error submitting report.');
      console.error('Error submitting report:', error);
    }
  };

  return (
    <>
      <Fab
        color="secondary"
        aria-label="report problem"
        onClick={handleOpen}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <ReportProblemIcon />
      </Fab>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="report-problem-modal-title"
        aria-describedby="report-problem-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="report-problem-modal-title" variant="h6" component="h2">
            Report a Problem
          </Typography>
          <TextField
            id="report-problem-modal-description"
            label="Describe the problem"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            sx={{ mt: 2, mb: 2 }}
          />
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Typography>
          )}
          <Button variant="contained" color="primary" onClick={handleReportSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ReportProblemFab;
