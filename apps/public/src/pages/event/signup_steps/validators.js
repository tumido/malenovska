const required = (text = 'Vyplňte') => value => (value ? undefined : text);

const isEmail = () => value => (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i.test(value) ? undefined : 'Toto není e-mailová adresa');

const isGreater = limit => value => (value >= limit ? undefined : `Musí být větší než ${limit}`);

const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined);

const validate = (names) => composeValidators(...names.map(n => {
  const [name, args] = typeof n === 'string' ? [n, []] : n;

  switch (name) {
    case 'required':
      return required(...args)
    case 'email':
      return isEmail(...args)
    case 'greater':
      return isGreater(...args)
    default:
      return undefined;
  }
}))

export default validate;
