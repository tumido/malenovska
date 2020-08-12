import React from 'react';
import { connect, useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import PropTypes from 'prop-types';

import { Typography, Grid, Container, Chip, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Article, ArticlePreview, EventAvailabilityChip, Markdown } from 'components';

const useStyles = makeStyles(theme => ({
  h1: {
    fontWeight: 600
  },
  banner: {
    paddingTop: '10vh',
    minHeight: '25vh',
    color: '#fff',
    marginBottom: 20
  },
  contentGrid: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(4)
    }
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
      <Grid item container xs={ 12 } sm={ 6 } lg={ 4 } key={ l.id }>
        <ArticlePreview article={ l } href={ `/${event.id}/legends/${l.id}` }/>
      </Grid>
    )) : (
      <React.Fragment>
        <Grid item xs={ 12 } sm={ 6 } lg={ 4 }>
          <ArticlePreview/>
        </Grid>
        <Grid item xs={ 12 } sm={ 6 } lg={ 4 }>
          <ArticlePreview/>
        </Grid>
        <Grid item xs={ 12 } sm={ 6 } lg={ 4 }>
          <ArticlePreview/>
        </Grid>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <Hidden xsDown>
        <Container>
          <Grid container direction="column" justify="center" spacing={ 2 } alignItems="center" className={ classes.banner }>
            <Grid item>
              <Typography gutterBottom variant='h1' className={ classes.h1 }>{ event.name }</Typography>
              <Chip label={ event.type ? 'Bitva' : 'Šarvátka' } className={ classes.chip }/>
              <Chip label={ `${ event.type ? 'Podzim' : 'Jaro' } ${event.year}` } className={ classes.chip }/>
              <EventAvailabilityChip event={ event } className={ classes.chip }/>
            </Grid>
            <Grid item>
              <Markdown content={ event.description } />
            </Grid>
          </Grid>
        </Container>
      </Hidden>
      <Container maxWidth="lg">
        { !isEmpty(legendsList) && <Grid container spacing={ 2 } justify="center" alignItems='stretch' className={ classes.contentGrid }>{ legendsList }</Grid>}
      </Container>
    </React.Fragment>
  );
};

List.propTypes = {
  legends: PropTypes.array,
  event: PropTypes.object
};

export default connect(({ event }) => ({ event }))(List);
