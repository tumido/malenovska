import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Stepper, MobileStepper, Step, StepLabel, Hidden, Button, Icon, Portal } from '@material-ui/core';
import WizardPage from './WizardPage';
import { submit, isValid } from 'redux-form';

const Wizard = ({
  stepperProps = {},
  mobileStepperProps = {},
  children,
  onSubmit,
  formName,
  submit,
  validate,
  isValid,
  buttonText = {}
}) => {
  const [ activeStep, setActiveStep ] = React.useState(0);

  const stepperEl = React.useRef(null);
  const mobileStepperEl = React.useRef(null);

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const steps = React.Children.map(children, (step, idx) => (
    <WizardPage
      key={ idx }
      onSubmit={ (idx !== React.Children.count(children) - 1) ? handleNext : onSubmit }
      form={ formName }
      validate={ validate }
    >
      { step }
    </WizardPage>
  ));

  return (
    <React.Fragment>
      <Hidden smDown>
        <div ref={ stepperEl } />
        <Portal container={ stepperProps.ref || stepperEl.current }>
          <Stepper
            activeStep={ activeStep }
            { ...((({ ref, ...others }) => ({ ...others }))(stepperProps)) }
          >
            {steps.map(label => (
              <Step key={ label }>
                <StepLabel />
              </Step>
            ))}
          </Stepper>
        </Portal>
      </Hidden>

      { steps[activeStep] }

      <Hidden smDown>
        <div>
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
            { (activeStep !== React.Children.count(children) - 1) ? (buttonText.next || 'Další') : (buttonText.nextFinal || 'Odeslat') }
          </Button>
        </div>
      </Hidden>

      <Hidden mdUp>
        <div ref={ mobileStepperEl } />
        <Portal container={ mobileStepperProps.ref || mobileStepperEl.current }>
          <MobileStepper
            { ...((({ ref, ...others }) => ({ ...others }))(mobileStepperProps)) }
            // position="static"
            // variant="text"
            activeStep={ activeStep }
            steps={ React.Children.count(children) }
            backButton={ <Button size="small" onClick={ handleBack } disabled={ activeStep === 0 }>
              <Icon>keyboard_arrow_left</Icon>
              { buttonText.previous || 'Zpět'}
            </Button> }
            nextButton={ <Button size="small" onClick={ () => submit(formName) }>
              { (activeStep !== React.Children.count(children) - 1) ? (buttonText.next || 'Další') : (buttonText.nextFinal || 'Odeslat') }
              <Icon>keyboard_arrow_right</Icon>
            </Button> }
          />
        </Portal>
      </Hidden>
    </React.Fragment>
  );
};

Wizard.propTypes = {
  stepperProps: PropTypes.object,
  mobileStepperProps: PropTypes.object,
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  formName: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  buttonText: PropTypes.shape({
    previous: PropTypes.string,
    next: PropTypes.string,
    nextFinal: PropTypes.string
  }),
  isValid: PropTypes.bool,
  validate: PropTypes.func
};

export default connect(
  (state, { formName }) => ({
    isValid: isValid(formName)(state)
  }),
  { submit }
)(Wizard);
