import React from 'react';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Typography, Grid, Container, Chip, Hidden, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ArticlePreview, EventAvailabilityChip } from 'components';

const useStyles = makeStyles(theme => ({
  h1: {
    fontWeight: 600
  },
  banner: {
    paddingTop: '10vh',
    minHeight: '25vh',
    color: '#fff',
    marginBottom: '10vh'
  },
  contentGrid: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4)
    }
  },
  contentContainer: {
    paddingTop: '70px'
  },
  card: {
    maxHeight: 300,
    textOverflow: 'ellipsis'
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

const List = ({ event }) => {
  const classes = useStyles();

  useFirestoreConnect(() => ([
    {
      collection: 'legends',
      where: [ 'event', '==', event.id ],
      storeAs: `legends_${event.id}`
    }
  ]));
  const legends = useSelector(({ firestore }) => firestore.ordered[`legends_${event.id}`]);

  const legendsList = isLoaded(legends)
    ? legends.map(l => (
      <Grid item xs={ 12 } key={ l.id }>
        <ArticlePreview article={ l } href={ `/${event.id}/legends/${l.id}` }/>
      </Grid>
    )) : (
      <React.Fragment>
        <Grid item xs={ 12 }>
          <ArticlePreview/>
        </Grid>
        <Grid item xs={ 12 }>
          <ArticlePreview/>
        </Grid>
      </React.Fragment>
    );

  return (
    <Container>
      <Hidden xsDown>
        <Grid container direction="column" justify="center" alignItems="center" className={ classes.banner }>
          <Grid item>
            <Typography gutterBottom variant='h1' className={ classes.h1 }>{ event.name }</Typography>
            <Chip label={ event.type ? 'Bitva' : 'Šarvátka' } className={ classes.chip }/>
            <Chip label={ `${ event.type ? 'Podzim' : 'Jaro' } ${event.year}` } className={ classes.chip }/>
            <EventAvailabilityChip event={ event } className={ classes.chip }/>
          </Grid>
        </Grid>
      </Hidden>
      <Paper>
        <Container maxWidth="lg" className={ classes.contentContainer }>
          <Typography gutterBottom variant='h4'>Legendy a příběhy</Typography>
          <Typography gutterBottom variant='body1'>Letošním ročníkem vás provedou následující příběhy.</Typography>
          <Grid container spacing={ 4 } justify="center" alignItems='stretch' className={ classes.contentGrid }>
            { legendsList }
          </Grid>
        </Container>
      </Paper>
    </Container>
  );
};

List.propTypes = {
  legends: PropTypes.array,
  event: PropTypes.object
};

export default connect(({ event }) => ({ event }))(List);
