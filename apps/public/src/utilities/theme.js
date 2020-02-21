import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, grey } from '@material-ui/core/colors';
import { csCZ } from '@material-ui/core/locale';

const palette = {
  secondary: deepOrange,
  loading: [
    'rgb(253, 38, 0)', 'rgb(241, 238, 16)', 'rgb(255, 145, 0)'
  ]
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    ...palette
  }
}, csCZ);

export const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[50]
    },
    type: 'dark',
    ...palette
  }
}, csCZ);
