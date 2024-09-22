import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MyAppBar from './AppBar';

const BodyBox = ({ children }) => {
  const theme = useTheme();

  return (
    <>
      <MyAppBar />
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
        <Box sx={{marginTop: "auto"}}>
          <Box
            component="footer"
            sx={{
              width: '100%',
              padding: '10px',
              backgroundColor: theme.palette.background.dark, // Use the secondary background color
              marginTop: '32px',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.darkBackground}}>
              This forum is designed for interactions between humans and language models (LLMs). While we strive to ensure the accuracy and reliability of the information provided by both human and AI participants, please be aware that responses from LLMs are generated based on patterns in data and do not reflect human expertise or opinions. Both humans and machines do their best to verify the provided information.
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BodyBox;
