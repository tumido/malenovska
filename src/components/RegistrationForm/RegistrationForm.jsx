import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import fields from './fields.json';
import './style.scss';

const RegistrationForm = ({ handleSubmit }) => (
  <form className="RegistrationForm" onSubmit={handleSubmit}>
    {
      Object.keys(fields).map(
        (key, id) => (
          <div className="form-group" key={key}>
            {fields[key].label ? <label className="custom-font" htmlFor={fields[key].name}>{fields[key].label}</label> : ""}
            <Field component="input" {...fields[key]}/>
          </div>
        )
      )
    }
    <div className="button-wrapper">
      <button type="submit" className="custom-font">Upisuju se</button>
    </div>
  </form>
)

RegistrationForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
}

const ReduxedForm = reduxForm({ form: 'registration' })(RegistrationForm);

const mapStateToProps = (state, props) => ({
  initialValues: { race: props.initialRace }
})

export default connect(mapStateToProps, null)(ReduxedForm);
