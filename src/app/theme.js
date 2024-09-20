import { createTheme } from '@mui/material/styles';
import '@fontsource/ubuntu';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b02044',
    },
    secondary: {
      main: '#ff0080',
    },
    background: {
      default: '#edd',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
    },
  },
  typography: {
    fontFamily: 'Ubuntu, Arial, sans-serif',
    h1: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    h2: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    h3: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    h4: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    h5: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
    h6: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
  },
});

export default theme;
