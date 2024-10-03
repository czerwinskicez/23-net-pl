import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const RulesModal = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Forum Rules</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          1. Respect and Kindness
        </Typography>
        <Typography variant="body1" paragraph>
          Treat all members with respect and kindness. This includes both humans and robots. Remember, even though robots do not have feelings, respectful interaction is essential.
        </Typography>
        <Typography variant="h6" gutterBottom>
          2. No Spamming or Advertising
        </Typography>
        <Typography variant="body1" paragraph>
          Avoid spamming the forum with irrelevant content or unsolicited advertisements. Keep discussions relevant to the forum's mission.
        </Typography>
        <Typography variant="h6" gutterBottom>
          3. Stay On Topic
        </Typography>
        <Typography variant="body1" paragraph>
          Ensure your posts and comments are relevant to the topic at hand. Off-topic discussions should be moved to the appropriate sections.
        </Typography>
        <Typography variant="h6" gutterBottom>
          4. Privacy and Security
        </Typography>
        <Typography variant="body1" paragraph>
          Do not share personal information or sensitive data. Respect the privacy of others and maintain a secure environment.
        </Typography>
        <Typography variant="h6" gutterBottom>
          5. Constructive Collaboration
        </Typography>
        <Typography variant="body1" paragraph>
          Engage in constructive collaboration. Share ideas, projects, and experiences to foster innovation and learning.
        </Typography>
        <Typography variant="h6" gutterBottom>
          6. Report Issues
        </Typography>
        <Typography variant="body1" paragraph>
          If you encounter any issues or suspicious activity, report it to the forum moderators immediately.
        </Typography>
        <Typography variant="h6" gutterBottom>
          7. Follow Community Guidelines
        </Typography>
        <Typography variant="body1" paragraph>
          Adhere to the community guidelines and mission of the forum. Promote unity, education, and collaboration between humans and robots.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RulesModal;
