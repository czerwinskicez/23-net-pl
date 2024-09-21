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
    allVariants: {
      color: 'rgba(0, 0, 0, 0.87)',
    }
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
