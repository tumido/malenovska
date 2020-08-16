import React from 'react';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';

import { Grid, Hidden } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Article, Wizard } from 'components';
import { RaceSelect, Readout, PersonalDetails } from './steps';
import { registerNewParticipant  } from '../../redux/actions/participant-actions';

const useStyles = makeStyles(() => ({
  stepper: {
    background: 'transparent'
  },
  buttons: {
    margin: 20,
    '& > *': {
      margin: 20
    }
  },
  buttonWrapper: {
    alignSelf: 'center'
  }
}));

const New = ({ event, registerNewParticipant, history }) => {
  const classes = useStyles();

  useFirestoreConnect(() => [
    {
      collection: 'races',
      where: [ 'event', '==', event.id ],
      storeAs: `${event.id}_races`
    },
    {
      collection: 'participants',
      where: [ 'event', '==', event.id ],
      storeAs: `${event.id}_participants`
    }
  ]);

  const races = useSelector(({ firestore }) => firestore.ordered[`${event.id}_races`]);
  const participants = useSelector(({ firestore }) => firestore.ordered[`${event.id}_participants`]);

  const [ stepperEl, setStepperEl ] = React.useState(null);
  const handleStepperRef = React.useCallback(instance => setStepperEl(instance), [ setStepperEl ]);

  const [ buttonsEl, setButtonsEl ] = React.useState(null);
  const handleButtonsRef = React.useCallback(instance => setButtonsEl(instance), [ setButtonsEl ]);

  const handleSubmit = values => {
    registerNewParticipant({ event: event.id, ...values });
    history.push('./done', { isUnderage: (values.age < 18) });
  };

  return (
    <Article scrollTop={ false }>
      <Grid container direction='column' wrap='nowrap' spacing={ 2 } >
        <Hidden smDown>
          <Grid item ref={ handleStepperRef }/>
        </Hidden>
        <Grid item>
          <Wizard
            isLoading={ !isLoaded(races) || !isLoaded(participants) }
            onSubmit={ handleSubmit }
            subscription={ { submitting: true, pristine: true } }
            stepperProps={ {
              className: classes.stepper,
              names: [
                'Výběr strany',
                'Legenda',
                'Osobní údaje'
              ]
            } }
            buttonsProps={ {
              className: classes.buttons
            } }
            portals={ {
              stepper: stepperEl,
              buttons: buttonsEl
            } }
            classes={ classes }
          >
            <Wizard.Page>
              <RaceSelect
                texts={ {
                  above: event.registrationBeforeAbove,
                  below: event.registrationBeforeBelow
                } }
                races={ races }
                participants={ participants }
              />
            </Wizard.Page>
            <Wizard.Page>
              <Readout races={ races } participants={ participants }/>
            </Wizard.Page>
            <Wizard.Page>
              <PersonalDetails races={ races }/>
            </Wizard.Page>
          </Wizard>
        </Grid>
        <Grid item className={ classes.buttonWrapper } ref={ handleButtonsRef }/>
      </Grid>
    </Article>
  );
};

New.propTypes = {
  event: PropTypes.object.isRequired,
  registerNewParticipant: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default compose(
  withRouter,
  connect(
    ({ event }) => ({ event }),
    { registerNewParticipant }
  )
)(New);
