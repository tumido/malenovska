import React from 'react';
import PropTypes from 'prop-types';
import { Stepper, MobileStepper, Step, StepLabel, Hidden, Button, Icon, Portal } from '@material-ui/core';
import WizardPage from './WizardPage';

const Wizard = ({
  stepperProps = {},
  mobileStepperProps = {},
  children,
  onSubmit,
  formName
}) => {
  const [ activeStep, setActiveStep ] = React.useState(0);

  const stepperEl = React.useRef(null);
  const mobileStepperEl = React.useRef(null);

  const handleNext = () => {
    setActiveStep(prev => prev + 1);
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  }

  const steps = React.Children.map(children, (step, idx) => (
    (idx !== React.Children.count(children) - 1)
      ? <WizardPage key={ idx } onSubmit={ handleNext } form={ formName }>{ step }</WizardPage>
      : <WizardPage key={ idx } onSubmit={ onSubmit } form={ formName }>{ step }</WizardPage>
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
        <Button
          disabled={ activeStep === 0 }
          onClick={ handleBack }
        >
          Zpět
        </Button>
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
            backButton={
              <Button size="small" onClick={ handleBack } disabled={ activeStep === 0 }>
                <Icon>keyboard_arrow_left</Icon>
                Zpět
              </Button>
            }
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
  formName: PropTypes.string.isRequired
}

export default Wizard;
