import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';
import { useFirebase } from 'react-redux-firebase';

import { Typography, Chip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';

import { getURL } from 'redux/actions/storage-actions';

const useStyles = makeStyles(theme => ({
  image: {
    height: 400,
    width: '100%',
    objectFit: 'contain'
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

const Readout = ({ races, selectedRace, participants, getURL }) => {
  const classes = useStyles();
  const race = races.filter(({ id }) => id === selectedRace)[0];

  const fileRef = useFirebase().storage().ref().child(`races/${selectedRace}`);

  const [ imageUrl, setImageUrl ] = React.useState(null);
  getURL(`races/${race.id}`).then(url => setImageUrl(url));

  return (
    <React.Fragment>
      <Typography gutterBottom variant='h5' component='h2'>
        { race.name }
        <Chip label={ `${participants.filter(p => p.race === selectedRace).length} / ${race.limit}` } className={ classes.chip } />
      </Typography>
      <Typography gutterBottom variant='subtitle1'>
        Každá strana žije svůj příběh. Má svůj boj, svůj cíl...
      </Typography>
      { imageUrl ? <img className={ classes.image } src={ imageUrl } /> : <Skeleton variant='rect' className={ classes.image } /> }
      <Typography variant='body1'>
        { race.legend }
      </Typography>
    </React.Fragment>
  );
};

Readout.propTypes = {
  races: PropTypes.array.isRequired,
  selectedRace: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired
};

export default compose(
  formValues({ selectedRace: 'race' }),
  connect(null, { getURL })
)(Readout);
