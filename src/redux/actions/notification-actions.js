import { SNACKBAR } from '../actionTypes';

export const openSnackbar = payload => ({ type: SNACKBAR.open, payload });
export const closeSnackbar = key => ({ type: SNACKBAR.close, payload: { key }});
