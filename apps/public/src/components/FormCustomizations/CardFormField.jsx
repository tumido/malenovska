import React from 'react';
import PropTypes from 'prop-types';

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

const CardFormField = ({ input, race, participants }) => {
  const classes = useStyles();

  return (
    <Grid item xs={ 12 } lg={ 6 }>
      <Card elevation={ input.value === race.id ? 12 : 4 }>
        <CardActionArea
          onClick={ () => input.onChange(race.id) }
          className={ input.value === race.id ? classes.raised : classes.normal }
          disabled={ participants.filter(p => p.race === race.id).length >= race.limit }
        >
          <input style={ { display: 'none' } } { ...input } value={ race.id } type='radio'/>
          <CardMedia
            className={ classes.media }
            image={ race.image && race.image.src }
            title={ race.name }
          />
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

CardFormField.propTypes = {
  input: PropTypes.object.isRequired,
  race: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired
};

export default CardFormField;
