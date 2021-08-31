import React from 'react';
import PropTypes from 'prop-types';
import { Field, FormSpy } from 'react-final-form';

import { TextField, Typography, Grid, Icon, CardContent, Box } from '@material-ui/core';
import { TextFormField, ColorBadge, CheckboxFormField } from 'components';
import { required, isGreater, composeValidators, isEmail } from './validators';
import { Markdown } from 'components';

const formFields = races => [
  {
    size: 4,
    field: (
      <Field
        id='nickName'
        name='nickName'
        label='Přezdívka'
        placeholder='Mirek'
        component={ TextFormField }
      />
    )
  },
  {
    size: 4,
    field: (
      <Field
        id='firstName'
        name='firstName'
        label='Jméno'
        placeholder='Mirek'
        required
        validate={ required() }
        component={ TextFormField }
      />
    )
  },
  {
    size: 4,
    field: (
      <Field
        id='lastName'
        name='lastName'
        label='Příjmení'
        placeholder='Dušín'
        required
        validate={ required() }
        component={ TextFormField }
      />
    )
  },
  {
    field: (
      <Field
        id='email'
        name='email'
        label='E-mail'
        placeholder='mirek@rychlesipy.cz'
        required
        validate={ composeValidators(required(), isEmail) }
        component={ TextFormField }
      />
    )
  },
  {
    size: 10,
    field: (
      <Field
        id='group'
        name='group'
        label='Skupina'
        placeholder='Rychlé Šípy'
        component={ TextFormField }
      />
    )
  },
  {
    size: 2,
    field: (
      <Field
        id='age'
        name='age'
        label='Věk'
        type='number'
        InputProps={ { inputProps: { min: 10 }} }
        required
        validate={ composeValidators(required(), isGreater(10)) }
        component={ TextFormField }
      />
    )
  },
  {
    field: (
      <FormSpy subscription={ { values: true } }>
        {({ values }) => (
          <TextField
            id='race-read-only'
            label='Strana'
            defaultValue={ races.filter(({ id }) => id === values.race)[0].name }
            variant='outlined'
            fullWidth
            InputProps={ {
              readOnly: true
            } }
          />
        )}

      </FormSpy>
    )
  },
  {
    field: (
      <Grid container direction='column' alignItems="center" spacing={ 2 }>
        <Grid item>
          <Typography variant='body1'>
         Pro přijetí výše uvedených údajů je třeba tvůj souhlas.
         Slibujeme, že s&nbsp;tvými údaji budeme nakládat pouze pro potřeby konání akce
         a nebudeme je uchovávat déle, než je nezbytně nutné.
          </Typography>
        </Grid>
        <Grid item>
          <Field
            id='terms'
            name='terms'
            label='Souhlasím'
            type="checkbox"
            validate={ required('Souhlas je nutný') }
            component={ CheckboxFormField }
            icon={ <Icon>favorite_border</Icon> }
            checkedIcon={ <Icon>favorite</Icon> }
          />
        </Grid>
      </Grid>
    )
  }
];

const PersonalDetails = ({ races }) => (
  <React.Fragment>
    <FormSpy subscription={ { values: true } }>
      {({ values }) => {
        const race = races.filter(({ id }) => id === values.race)[0];
        return (
          <React.Fragment>
            <ColorBadge variant='line' color={ race.color } />
            <CardContent>
              <Typography gutterBottom variant='h4' component='h2'>Charakteristika strany</Typography>
              <Markdown content={ race.requirements } />
              <ColorBadge variant='fab' color={ race.color } />
            </CardContent>
          </React.Fragment>
        );
      }}
    </FormSpy>
    <CardContent>
      <Box paddingY={ 2 }>
        <Typography variant='h5' component='h2'>Osobní údaje</Typography>
      </Box>
      <Grid container justifyContent='center' spacing={ 3 }>
        {formFields(races).map((item, idx) => (
          <Grid item xs={ 12 } sm={ item.size } key={ idx }>
            {item.field}
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </React.Fragment>
);

PersonalDetails.propTypes = {
  races: PropTypes.array.isRequired
};

export default PersonalDetails;
