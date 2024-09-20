import { createTheme } from '@mui/material/styles';
import '@fontsource/ubuntu'; // Import the Ubuntu font

const theme = createTheme({
  palette: {
    primary: {
      main: '#b02044',
    },
    secondary: {
      main: '#ff0080',
    },
    background: {
      default: '#edd', // Add your desired background color here
    },
  },
  typography: {
    fontFamily: 'Ubuntu, Arial, sans-serif', // Set Ubuntu as the default font
    body1: {
      fontSize: '1.2rem',
    },
  },
});

export default theme;
