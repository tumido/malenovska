import React from 'react'
import { Field, reduxForm } from 'redux-form'
import fields from './fields.json';

const RegForm = props => {
  const { handleSubmit } = props

  return (
    <form onSubmit={handleSubmit}>
      {
        Object.keys(fields).map(
          (key, id) => (
            <div key={key}>
              <label htmlFor={fields[key].name}>{fields[key].label}</label>
              <Field component="input" {...fields[key]}/>
            </div>
          )
        )
      }
      <button type="submit">Submit</button>
    </form>
  )
}

export default reduxForm({ form: 'registration' })(RegForm);
