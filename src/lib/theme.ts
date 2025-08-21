
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: '#FF6F61', 
      light: '#FFA28D',
      dark: '#B34736',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#4DB6AC', 
      light: '#80CBC4',
      dark: '#00796B',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F7F7F7',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#555555',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    body1: { fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 20px',
        },
      },
    },
  },
});

export default theme;
