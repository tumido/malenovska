import React from 'react'
import { Field, reduxForm } from 'redux-form'
import fields from './fields.json';
import { connect } from 'react-redux';

import './style.scss';

const RegForm = props => {
  const { handleSubmit } = props

  return (
    <form className="RegForm" onSubmit={handleSubmit}>
      {
        Object.keys(fields).map(
          (key, id) => (
            <div className="form-group" key={key}>
              {fields[key].label ? <label htmlFor={fields[key].name}>{fields[key].label}</label> : ""}
              <Field component="input" {...fields[key]}/>
            </div>
          )
        )
      }
      <div className="button-wrapper">
        <button type="submit">Stvrzuju a upisuji se</button>
      </div>
    </form>
  )
}

const ReduxedForm = reduxForm({ form: 'registration' })(RegForm);

const mapStateToProps = (state) => ({
  initialValues: { race: "Lidé"} // FIXME!!
})

export default connect(mapStateToProps, null)(ReduxedForm);
