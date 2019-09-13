import React from 'react';
import { makeStyles, Grid } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '3rem 0',
    color: grey[400],
    '& a, & a:hover': {
      color: 'inherit'
    }
  }
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Grid container direction='column' justify='center' alignItems='center' component='footer' className={ classes.root }>
      <Grid item>
        Zlišky <span role="img" area-label="heart-emoji">❤️</span> Malenovská
      </Grid>
      <Grid item>
        <a href="https://reactjs.org/">React</a>, <a href="https://redux.js.org/">Redux</a>, <a href="https://firebase.google.com/docs/firestore/">Google Cloud Firestore</a>
      </Grid>
    </Grid>
  );
}

export default Footer;
