import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Hidden, Container, Chip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { EventAvailabilityChip } from 'components';

const useStyles = makeStyles(theme => ({
  h1: {
    fontWeight: 600
  },
  h2: {
    fontWeight: 600,
    color: 'black',
    marginBottom: theme.spacing(-2)
  },
  banner: {
    paddingTop: '10vh',
    minHeight: '25vh',
    color: '#fff',
    marginBottom: 30
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

const Banner = ({ event, title, children }) => {
  const styles = useStyles();

  return (
    <Hidden xsDown>
      <Container>
        <Grid container direction="column" justify="center" spacing={ 2 } alignItems="center" className={ styles.banner }>
          <Grid item>
            { title && <Typography variant='h2' className={ styles.h2 }>{ title }</Typography>}
            <Typography gutterBottom variant='h1' className={ styles.h1 }>{ event.name }</Typography>
            <Chip label={ event.type ? 'Bitva' : 'Šarvátka' } className={ styles.chip }/>
            <Chip label={ `${ event.type ? 'Podzim' : 'Jaro' } ${event.year}` } className={ styles.chip }/>
            <EventAvailabilityChip event={ event } className={ styles.chip }/>
          </Grid>
          { React.Children.map(children, (c, idx) => (
            <Grid item key={ idx }>
              {c}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Hidden>
  );
};

Banner.propTypes = {
  event: PropTypes.object,
  children: PropTypes.node,
  title: PropTypes.string
};

export default Banner;
