import { createTheme } from '@mui/material/styles';
import { deepOrange, grey } from '@mui/material/colors';
import { csCZ } from '@mui/material/locale';

const palette = {
  secondary: deepOrange,
  loading: [
    'rgb(253, 38, 0)', 'rgb(241, 238, 16)', 'rgb(255, 145, 0)'
  ]
};

export const theme = createTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    ...palette
  }
}, csCZ);

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: grey[50],
    },
    ...palette
  }
}, csCZ);
