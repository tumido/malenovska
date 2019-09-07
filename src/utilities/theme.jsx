import { createMuiTheme } from '@material-ui/core';
import { deepOrange, grey } from '@material-ui/core/colors';

export const MalenovskaTheme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    secondary: deepOrange
  }
});
