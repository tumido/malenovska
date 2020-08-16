export const required = (text = 'Vyplňte') => value => (value ? undefined : text);

export const isEmail = value => (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i.test(value) ? undefined : 'Toto není e-mailová adresa');

export const isGreater = limit => value => (value >= limit ? undefined : `Musí být větší než ${limit}`);

export const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);
