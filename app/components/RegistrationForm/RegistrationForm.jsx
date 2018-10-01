import React from 'react'
import { Field, reduxForm } from 'redux-form'
import fields from './fields.json';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

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

const ReduxedForm = reduxForm({ form: 'registration' })(RegForm);

const mapStateToProps = (state) => ({
  initialValues: { race: "gcVBDoyCXoFWEYhRmwBn"} // FIXME!!
})

export default connect(mapStateToProps, null)(ReduxedForm);
