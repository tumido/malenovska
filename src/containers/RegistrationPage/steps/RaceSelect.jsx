import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { useFirebase } from 'react-redux-firebase';
import { Card, CardActionArea, CardContent, Typography, CardMedia, Grid, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  raised: {
    border: `2px solid ${theme.palette.secondary.main}`
  },
  normal: {
    border: '2px solid transparent'
  },
  media: {
    height: 200
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

const renderField = ({ input, race, participants }) => {
  const classes = useStyles();

  const fileRef = useFirebase().storage().ref().child(`races/${race.id}`);

  const [ imageUrl, setImageUrl ] = React.useState(null);
  fileRef.getDownloadURL()
  .then(url => setImageUrl(url))
  .catch(err => console.error('Missing image', err.message_)); // eslint-disable-line no-console

  return (
    <Grid item xs={ 12 } lg={ 6 }>
      <Card elevation={ input.value === race.id ? 12 : 4 }>
        <CardActionArea
          onClick={ () => input.onChange(race.id) }
          className={ input.value === race.id ? classes.raised : classes.normal }
        >
          <input style={ { display: 'none' } } { ...input } value={ race.id } type='radio'/>
          <CardMedia
            className={ classes.media }
            image={ imageUrl || '\'\'' }
            title="Contemplative Reptile"
          />
          <CardContent>
            <Typography variant='h5' component='h2'>
              {race.name} <Chip label={ `${participants.filter(p => p.raceId === race.id).length} / ${race.limit}` } className={ classes.chip } />
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

renderField.propTypes = {
  input: PropTypes.object.isRequired,
  race: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired
};

const RaceSelect = ({ races, participants }) => (
  <Grid container spacing={ 4 }>
    <Grid item xs={ 12 }>
      <Typography gutterBottom variant='h5' component='h2'>Vyber si stranu</Typography>
      <Typography gutterBottom variant='body1'>
        Jen za jednu stranu opravdu stojí bojovat. Jen jedna je ta správná. Která je to však pro tebe? Zvol moudře. Na výběr máš následující možnosti.
      </Typography>
    </Grid>
    { races.map(race =>
      <Field
        name='race'
        component={ renderField }
        key={ race.id }
        race={ race }
        participants={ participants }
      />) }
  </Grid>
);

RaceSelect.propTypes = {
  races: PropTypes.array,
  participants: PropTypes.array
};

export default RaceSelect;
