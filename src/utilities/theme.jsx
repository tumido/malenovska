import { createMuiTheme } from '@material-ui/core/styles';
import { deepOrange, grey } from '@material-ui/core/colors';

export const MalenovskaTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    secondary: deepOrange,
    loading: [
      'rgb(253, 38, 0)', 'rgb(241, 238, 16)', 'rgb(255, 145, 0)'
    ]
  }
});
