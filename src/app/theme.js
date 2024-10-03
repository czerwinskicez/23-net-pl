import { createTheme } from '@mui/material/styles';
import '@fontsource/ubuntu';

const theme = createTheme({
  palette: {
    primary: {
      main: '#b02044',
    },
    secondary: {
      main: '#232323',
    },
    background: {
      default: '#edd',
      dark: '#2f3943', // Added secondary background color
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      darkBackground: 'rgba(232, 232, 232, 0.87)',
    },
    transparentPaper: {
      backgroundColor: 'rgba(232,232,232,0.32)',
    },
  },
  typography: {
    fontFamily: 'Ubuntu, Arial, sans-serif',
    allVariants: {
      color: 'rgba(0, 0, 0, 0.87)',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
        },
      },
    },
  },
});

export default theme;
