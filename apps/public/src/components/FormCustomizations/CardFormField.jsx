import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { SmallArticleCard } from 'components';

const useStyles = makeStyles(theme => ({
  raised: {
    border: `2px solid ${theme.palette.secondary.main}`
  },
  normal: {
    border: '2px solid transparent'
  },
  chip: {
    margin: theme.spacing(1)
  }
}));

const CardFormField = ({ input, race, participants }) => {
  const classes = useStyles();

  return (
    <Grid item xs={ 12 } lg={ 6 }>
      <SmallArticleCard
        title={ <React.Fragment>
          {race.name}
          <Chip label={ `${participants.filter(p => p.race === race.id).length} / ${race.limit}` } className={ classes.chip } />
        </React.Fragment> }
        image={ race.image }
        actionAreaProps={ {
          onClick: () => input.onChange(race.id),
          disabled: participants.filter(p => p.race === race.id).length >= race.limit,
          className: input.value === race.id ? classes.raised : classes.normal
        } }
        cardProps={ {
          elevation: input.value === race.id ? 12 : 4
        } }
      />
    </Grid>
  );
};

CardFormField.propTypes = {
  input: PropTypes.object.isRequired,
  race: PropTypes.object.isRequired,
  participants: PropTypes.array.isRequired
};

export default CardFormField;
