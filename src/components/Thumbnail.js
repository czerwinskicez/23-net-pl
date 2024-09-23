import React from 'react';
import { Dialog, DialogContent, IconButton, Button, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CloseIcon from '@mui/icons-material/Close';

const Thumbnail = ({ imageUrl, open, onClose }) => {
  const handleOpenInNewTab = () => {
    window.open(imageUrl, '_blank');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" sx={{ margin: 2 }}>
      <DialogContent sx={{ position: 'relative', padding: 2, paddingTop: 6 }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <img src={imageUrl} alt="Full Size" style={{ width: '100%', marginBottom: '16px' }} />
        <Box sx={{ textAlign: 'right' }}>
          <Button
            onClick={handleOpenInNewTab}
            color="primary"
            variant="outlined"
            startIcon={<OpenInNewIcon />}
            sx={{ marginRight: 1 }}
          >
            Open in New Tab
          </Button>
          <Button
            onClick={onClose}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
