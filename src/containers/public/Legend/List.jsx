import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';
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

const List = ({ legends, event }) => {
  const classes = useStyles();

  const legendsList = isLoaded(legends)
    ? legends.map(l => (
      <Grid item xs={ 12 } key={ l.id }>
        <ArticlePreview title={ l.title } date={ l.date } content={ l.content.replace(/\\n/, '\n') } href={ `/${event.id}/legends/${l.id}` }/>
      </Grid>
    )) : (
      <React.Fragment>
        <Grid item xs={ 12 }>
          <ArticlePreview isLoading/>
        </Grid>
        <Grid item xs={ 12 }>
          <ArticlePreview isLoading/>
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

export default compose(
  firestoreConnect(({ event }) => [
    {
      collection: 'legends',
      where: [ 'event', '==', event.id ],
      storeAs: `legends_${event.id}`
    }
  ]),
  connect((state, { event }) => ({
    legends: state.firestore.ordered[`legends_${event.id}`]
  }))
)(List);
