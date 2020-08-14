import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { formValues } from 'redux-form';

import { TextField, Checkbox, Typography, Grid, FormControl, FormLabel, Icon, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { grey } from '@material-ui/core/colors';

import { Markdown } from 'components';

const useStyles = makeStyles({
  terms: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  readOnly: {
    backgroundColor: 'rgba(0, 0, 0, 0.09)',
    '& input': {
      color: grey[800]
    }
  },
  verticalSpace: {
    paddingTop: '1em',
    paddingBottom: '1em'
  }
});

const renderTextField = ({ input, label, meta: { touched, error }, placeholder, ...extra }) => (
  <TextField
    label={ label }
    placeholder={ placeholder }
    error={ Boolean(touched && error) }
    { ...input }
    { ...extra }
    fullWidth
    variant='outlined'
    InputLabelProps={ {
      shrink: true
    } }
  />
);

renderTextField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.any
  }),
  extra: PropTypes.object
};

const renderCheckbox = ({ input, label, required, meta: { touched, error }, ...extra }) => (
  <FormControl error={ Boolean(touched && error) } >
    <FormLabel required={ required }>
      <Checkbox { ...input } checked={ input.value } { ...extra }/>
      { label }
    </FormLabel>
  </FormControl>
);

renderCheckbox.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  required: PropTypes.bool,
  meta: PropTypes.shape({
    touched: PropTypes.bool.isRequired,
    error: PropTypes.any
  }),
  extra: PropTypes.object
};

const PersonalDetails = ({ races, selectedRace }) => {
  const classes = useStyles();
  const race = races.filter(({ id }) => id === selectedRace)[0];

  return (
    <React.Fragment>
      <CardContent>
        <Typography gutterBottom variant='h4' component='h2'>Charakteristika strany</Typography>
        <Markdown content={ race.requirements } />
        <Typography className={ classes.verticalSpace } variant='h5' component='h2'>Osobní údaje</Typography>
        <Grid container justify='center' spacing={ 3 }>
          <Grid item xs={ 12 } sm={ 4 }>
            <Field
              id='nickName'
              name='nickName'
              label='Přezdívka'
              placeholder='Mirek'
              component={ renderTextField }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <Field
              id='firstName'
              name='firstName'
              label='Jméno'
              placeholder='Mirek'
              required
              component={ renderTextField }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 4 }>
            <Field
              id='lastName'
              name='lastName'
              label='Příjmení'
              placeholder='Dušín'
              required
              component={ renderTextField }
            />
          </Grid>
          <Grid item xs={ 12 }>
            <Field
              id='email'
              name='email'
              label='E-mail'
              placeholder='mirek@rychlesipy.cz'
              required
              component={ renderTextField }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 10 }>
            <Field
              id='group'
              name='group'
              label='Skupina'
              placeholder='Rychlé Šípy'
              component={ renderTextField }
            />
          </Grid>
          <Grid item xs={ 12 } sm={ 2 }>
            <Field
              id='age'
              name='age'
              label='Věk'
              type='number'
              InputProps={ { inputProps: { min: 10 }} }
              required
              component={ renderTextField }
            />
          </Grid>
          <Grid item xs={ 12 }>
            <TextField
              id='race-read-only'
              label='Strana'
              defaultValue={ race.name }
              variant='outlined'
              className={ classes.readOnly }
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={ 12 } className={ classes.terms }>
            <Typography variant='body1'>
              Pro přijetí výše uvedených údajů je třeba tvůj souhlas. Slibujeme, že s&nbsp;tvými údaji budeme nakládat pouze pro potřeby konání akce
              a nebudeme je uchovávat déle, než je nezbytně nutné.
            </Typography>
            <Field
              id='terms'
              name='terms'
              label='Souhlasím'
              required
              component={ renderCheckbox }
              icon={ <Icon>favorite_border</Icon> }
              checkedIcon={ <Icon>favorite</Icon> }
            />
          </Grid>
        </Grid>
      </CardContent>
    </React.Fragment>
  );
};

PersonalDetails.propTypes = {
  races: PropTypes.array.isRequired,
  selectedRace: PropTypes.string.isRequired
};

export default formValues({ selectedRace: 'race' })(PersonalDetails);
