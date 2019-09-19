import React from 'react';
import PropTypes from 'prop-types';
import { formValues } from 'redux-form';
import { useFirebase } from 'react-redux-firebase';
import { Typography, Chip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';

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

const Readout = ({ races, selectedRace, participants }) => {
  const classes = useStyles();
  const race = races.filter(({ id }) => id === selectedRace)[0];

  const fileRef = useFirebase().storage().ref().child(`races/${selectedRace}`);

  const [ imageUrl, setImageUrl ] = React.useState(null);
  fileRef.getDownloadURL()
  .then(url => setImageUrl(url))
  .catch(err => console.error('Missing image', err.message_)); // eslint-disable-line no-console

  return (
    <React.Fragment>
      <Typography gutterBottom variant='h4' component='h2'>
        { race.name }
        <Chip label={ `${participants.filter(p => p.raceId === selectedRace).length} / ${race.limit}` } className={ classes.chip } />
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

export default formValues({ selectedRace: 'race' })(Readout);
