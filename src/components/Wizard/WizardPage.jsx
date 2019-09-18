import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

const WizardPageBase = ({ handleSubmit, children }) => (
  <form onSubmit={ handleSubmit }>
    { children }
  </form>
);

WizardPageBase.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  children: PropTypes.node
};

const WizardPage = reduxForm({
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true
})(WizardPageBase);

WizardPage.propTypes = {
  form: PropTypes.string.isRequired,
  previousPage: PropTypes.func,
  onSubmit: PropTypes.func.isRequired
};

export default WizardPage;
