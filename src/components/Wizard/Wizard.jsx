import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Prompt } from 'react-router-dom';
import { submit, isValid, isPristine, initialize } from 'redux-form';

import { Stepper, MobileStepper, Step, StepLabel, Hidden, Button, Icon, Portal } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import WizardPage from './WizardPage';

const Wizard = ({
  stepperProps = { names: []},
  mobileStepperProps = {},
  buttonsProps = {},
  children,
  onSubmit,
  formName,
  submit,
  validate,
  initialize,
  isValid,
  isPristine,
  isLoading,
  buttonText = {},
  portals = {}
}) => {
  if (isLoading) {
    return (
      <React.Fragment>
        <Skeleton variant='text' height={ 24 }/>
        <Skeleton variant='text'/>
        <Skeleton variant='rect' height={ 100 } />
        <br />
        <Skeleton variant='rect' height={ 100 } />
        <br />
        <Skeleton variant='rect' height={ 100 } />
        <Skeleton variant='text'/>
        <Skeleton variant='text'/>
        <Skeleton variant='text' width='50%'/>
      </React.Fragment>
    );
  }

  const [ activeStep, setActiveStep ] = React.useState(0);

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const isLast = activeStep === React.Children.count(children) - 1;

  const steps = React.Children.map(children, (step, idx) => (
    <WizardPage
      key={ idx }
      onSubmit={ !(isLast)
        ? handleNext
        : values => { onSubmit(values); setActiveStep(0); initialize(formName); } }
      form={ formName }
      validate={ validate }
    >
      { step }
    </WizardPage>
  ));

  return (
    <React.Fragment>
      <Prompt message={ () => initialize(formName) }/>  { /* Nasty fix. Clear wizard for on user leave. */ }
      <Hidden smDown>
        <Portal container={ portals.stepper } disablePortal={ !portals.stepper }>
          <Stepper
            activeStep={ activeStep }
            { ...stepperProps }
          >
            {steps.map((label, idx) => (
              <Step key={ idx }>
                <StepLabel>{ stepperProps.names[idx] }</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Portal>
      </Hidden>

      { steps[activeStep] }

      <Hidden smDown>
        <Portal container={ portals.buttons } disablePortal={ !portals.buttons } >
          <div { ...buttonsProps }>
            <Button
              size='large'
              disabled={ activeStep === 0 }
              onClick={ handleBack }
            >
              { buttonText.previous || 'Zpět'}
            </Button>
            <Button
              size='large'
              onClick={ () => submit(formName) }
              disabled={ !isValid }
              type='submit'
              color='secondary'
              variant='contained'
            >
              { !(isLast) ? (buttonText.next || 'Další') : (buttonText.nextFinal || 'Odeslat') }
            </Button>
          </div>
        </Portal>
      </Hidden>

      <Hidden mdUp>
        <Portal container={ portals.mobileStepper } disablePortal={ !portals.mobileStepper }>
          <MobileStepper
            { ...mobileStepperProps }
            // position="static"
            // variant="text"
            activeStep={ activeStep }
            steps={ React.Children.count(children) }
            backButton={ <Button size="small" onClick={ handleBack } disabled={ activeStep === 0 }>
              <Icon>keyboard_arrow_left</Icon>
              { buttonText.previous || 'Zpět'}
            </Button> }
            nextButton={ <Button size="small" onClick={ () => submit(formName) } disabled={ !isValid || isPristine }>
              {!(isLast) ? (buttonText.next || 'Další') : (buttonText.nextFinal || 'Odeslat') }
              <Icon>keyboard_arrow_right</Icon>
            </Button> }
          />
        </Portal>
      </Hidden>
    </React.Fragment>
  );
};

Wizard.propTypes = {
  stepperProps: PropTypes.shape({
    names: PropTypes.array.isRequired
  }),
  mobileStepperProps: PropTypes.object,
  buttonsProps: PropTypes.object,
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  buttonText: PropTypes.shape({
    previous: PropTypes.string,
    next: PropTypes.string,
    nextFinal: PropTypes.string
  }),
  validate: PropTypes.func,
  portals: PropTypes.shape({
    stepper: PropTypes.object,
    mobileStepper: PropTypes.object,
    buttons: PropTypes.object
  }),
  isLoading: PropTypes.bool,
  // connect() props
  submit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  isPristine: PropTypes.bool.isRequired
};

export default connect(
  (state, { formName }) => ({
    isValid: isValid(formName)(state),
    isPristine: isPristine(formName)(state)
  }),
  { submit, initialize }
)(Wizard);
