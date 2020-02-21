import { createMuiTheme } from '@material-ui/core/styles';
import { grey, indigo } from '@material-ui/core/colors';
import { csCZ } from '@material-ui/core/locale';

export const adminTheme = createMuiTheme({
  palette: {
    primary: indigo,
    secondary: {
      main: grey[900]
    }
  }
}, csCZ);
