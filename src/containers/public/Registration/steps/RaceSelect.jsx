import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { Card, CardActionArea, CardContent, Typography, CardMedia, Grid, Chip } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';

import { getURL } from 'redux/actions/storage-actions';

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

const renderFieldBase = ({ input, race, participants, getURL }) => {
  const classes = useStyles();

  const [ imageUrl, setImageUrl ] = React.useState(null);
  getURL(`races/${race.id}`).then(url => setImageUrl(url));

  return (
    <Grid item xs={ 12 } lg={ 6 }>
      <Card elevation={ input.value === race.id ? 12 : 4 }>
        <CardActionArea
          onClick={ () => input.onChange(race.id) }
          className={ input.value === race.id ? classes.raised : classes.normal }
          disabled={ participants.filter(p => p.race === race.id).length >= race.limit }
        >
          <input style={ { display: 'none' } } { ...input } value={ race.id } type='radio'/>
          { !imageUrl ? (
            <Skeleton variant="rect" className={ classes.media } />
          ) : (
            <CardMedia
              className={ classes.media }
              image={ imageUrl || '\'\'' }
              title="Contemplative Reptile"
            />
          )}
          <CardContent>
            <Typography variant='h5' component='h2'>
              {race.name} <Chip label={ `${participants.filter(p => p.race === race.id).length} / ${race.limit}` } className={ classes.chip } />
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};

renderFieldBase.propTypes = {
  input: PropTypes.object.isRequired,
  race: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired,
  getURL: PropTypes.func.isRequired
};

const renderField = connect(null, { getURL })(renderFieldBase);

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
