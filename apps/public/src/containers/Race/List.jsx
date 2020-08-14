import React from 'react';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Grid, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SmallArticleCard } from 'components';

const useStyles = makeStyles(theme => ({
  grid: {
    [theme.breakpoints.up('md')]: {
      minHeight: '100vh'
    }
  }
}));

const List = ({ event }) => {
  const styles = useStyles();
  useFirestoreConnect(() => [
    {
      collection: 'races',
      where: [ 'event', '==', event.id ],
      storeAs: `${event.id}_races`
    }
  ]);

  const races = useSelector(({ firestore }) => firestore.ordered[`${event.id}_races`]);

  if (!isLoaded(races)) {return '';}

  const raceCards = races.map(r => (
    <Grid
      item
      xs={ 12 }
      sm={ 6 }
      md={ 12 / races.length }
      key={ r.id }>
      <SmallArticleCard
        title={ r.name }
        image={ r.image }
        href={ `/${event.id}/races/${r.id}` }/>
    </Grid>
  ));

  return (
    <Container maxWidth="lg">
      { !isEmpty(races)
        && (
          <Grid
            container
            direction="row"
            alignItems="center"
            spacing={ 2 }
            className={ styles.grid }>
            { raceCards }
          </Grid>
        )}
    </Container>
  );
};

List.propTypes = {
  event: PropTypes.object.isRequired
};

export default connect(({ event }) => ({ event }))(List);
