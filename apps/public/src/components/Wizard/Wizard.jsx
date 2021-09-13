import React from "react";
import PropTypes from "prop-types";
import { Form } from "react-final-form";

import {
  Stepper,
  MobileStepper,
  Step,
  StepLabel,
  Hidden,
  Button,
  Icon,
  Portal,
  CardContent,
  Typography,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

import { ScrollRestoreOnMount, ArticleCardHeader } from "components";

const Wizard = ({
  stepperProps = { names: [] },
  mobileStepperProps = {},
  buttonsProps = {},
  children,
  onSubmit,
  buttonText = {},
  portals = {},
  isLoading = false,
  subscription,
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [values, setValues] = React.useState({});

  const handleNext = (values) => {
    setActiveStep((prev) => Math.min(prev + 1, children.length - 1));
    setValues((prev) => ({ ...prev, ...values }));
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const isLastStep = () => activeStep === React.Children.count(children) - 1;

  const handleSubmit = (values) => {
    return isLastStep() ? onSubmit(values) : handleNext(values);
  };

  const activePage = React.Children.toArray(children)[activeStep];

  const validate = (values) => {
    return activePage.props.validate ? activePage.props.validate(values) : {};
  };

  const buttonNextText = () => {
    if (!isLastStep()) {
      return buttonText.next || "Další";
    } else {
      return buttonText.nextFinal || "Odeslat";
    }
  };

  return (
    <Form
      initialValues={values}
      validate={validate}
      subscription={subscription}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit}>
          <Hidden smDown>
            <Portal
              container={portals.stepper}
              disablePortal={!portals.stepper}
            >
              <Stepper activeStep={activeStep} {...stepperProps}>
                {React.Children.toArray(children).map((label, idx) => (
                  <Step key={idx}>
                    <StepLabel>{stepperProps.names[idx]}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Portal>
          </Hidden>

          {!isLoading ? (
            activePage
          ) : (
            <React.Fragment>
              <ArticleCardHeader />
              <CardContent>
                {[...Array(2).keys()].map((_, idx) => (
                  <Typography key={idx} variant="body1">
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width={200} />
                  </Typography>
                ))}
              </CardContent>
            </React.Fragment>
          )}

          <Hidden smDown>
            <Portal
              container={portals.buttons}
              disablePortal={!portals.buttons}
            >
              <div {...buttonsProps}>
                <Button
                  size="large"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  {buttonText.previous || "Zpět"}
                </Button>
                <Button
                  size="large"
                  disabled={submitting}
                  type="submit"
                  color="secondary"
                  variant="contained"
                  onClick={handleSubmit}
                >
                  {buttonNextText()}
                </Button>
              </div>
            </Portal>
          </Hidden>

          <Hidden mdUp>
            <Portal
              container={portals.mobileStepper}
              disablePortal={!portals.mobileStepper}
            >
              <MobileStepper
                {...mobileStepperProps}
                activeStep={activeStep}
                steps={React.Children.count(children)}
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    <Icon>keyboard_arrow_left</Icon>
                    {buttonText.previous || "Zpět"}
                  </Button>
                }
                nextButton={
                  <Button
                    size="small"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {buttonNextText()}
                    <Icon>keyboard_arrow_right</Icon>
                  </Button>
                }
              />
            </Portal>
          </Hidden>
        </form>
      )}
    </Form>
  );
};

Wizard.propTypes = {
  stepperProps: PropTypes.shape({
    names: PropTypes.array.isRequired,
  }),
  mobileStepperProps: PropTypes.object,
  buttonsProps: PropTypes.object,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  buttonText: PropTypes.shape({
    previous: PropTypes.string,
    next: PropTypes.string,
    nextFinal: PropTypes.string,
  }),
  portals: PropTypes.shape({
    stepper: PropTypes.object,
    mobileStepper: PropTypes.object,
    buttons: PropTypes.object,
  }),
  isLoading: PropTypes.bool,
  subscription: PropTypes.object,
};

Wizard.Page = ({ children }) => (
  <React.Fragment>
    <ScrollRestoreOnMount />
    {children}
  </React.Fragment>
);

Wizard.Page.propTypes = {
  children: PropTypes.node.isRequired,
};

Wizard.Page.displayName = "Wizard.Page";

export default Wizard;
