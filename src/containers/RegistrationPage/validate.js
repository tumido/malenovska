const validate = values => {
  const errors = {};
  if (!values.race) {
    errors.race = 'Required';
  }

  if (!values.firstName) {
    errors.lastName = 'Required';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.age) {
    errors.age = 'Required';
  } else if (values.age < 15) {
    errors.email = 'Too young';
  }

  return errors;
};

export default validate;
