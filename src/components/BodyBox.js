import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const BodyBox = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="calc(100vh - 64px)"
      textAlign="center"
      paddingTop="10px"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      {children}
    </Box>
  );
};

export default BodyBox;
