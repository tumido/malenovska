import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, makeStyles, Button } from '@material-ui/core';

import { Logo } from 'components';
import BgImage from '../../../assets/images/background.jpg';

const styles = makeStyles({
  h1: {
    fontWeight: 600,
    fontSize: '9rem'
  },
  root: {
    minHeight: '100vh',
    background: `url(${BgImage}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    color: '#fff',
    margin: 0,
    width: '100vw'
  }
});

const NotFound = () => {
  const classes = styles();

  return (
    <Grid container spacing={ 2 } direction='column' justify='center' alignItems='center' className={ classes.root }>
      <Grid item>
        <Typography gutterBottom variant='h1' className={ classes.h1 }>
          Nenalezen
          <Logo size='5rem' bgColor='#fff' fgColor='#000' />
        </Typography>
      </Grid>
      <Grid item>
        <Typography gutterBottom variant='body1'>Tato stránka byla náhodou sežrána organizátory, či spálena gobliny.</Typography>
      </Grid>
      <Grid item>
        <Button variant='contained' color='secondary' size='large' to='/' component={ Link }>Chci na hlavní stránku</Button>
      </Grid>
    </Grid>
  );
};

export default NotFound;
