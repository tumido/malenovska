const validate = values => {
  const errors = {};
  if (!values.race) {
    errors.race = true;
  }

  if (!values.firstName) {
    errors.firstName = true;
  }

  if (!values.lastName) {
    errors.lastName = true;
  }

  if (!values.email) {
    errors.email = true;
  } else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i.test(values.email)) {
    errors.email = 'Formát adresy neodpovídá';
  }

  if (!values.age) {
    errors.age = true;
  } else if (values.age < 10) {
    errors.age = 'Málo';
  }

  if (!values.terms) {
    errors.terms = true;
  }

  return errors;
};

export default validate;
