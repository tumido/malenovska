type ValidatorFn = (value: string | number | boolean | undefined) => string | undefined;

const required = (text = "Vyplňte"): ValidatorFn => (value) =>
  value ? undefined : text;

const isEmail = (): ValidatorFn => (value) =>
  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i.test(String(value ?? ""))
    ? undefined
    : "Toto není e-mailová adresa";

const isGreater = (limit: number): ValidatorFn => (value) =>
  Number(value) >= limit ? undefined : `Musí být větší než ${limit}`;

function composeValidators(...validators: ValidatorFn[]): ValidatorFn {
  return (value) =>
    validators.reduce<string | undefined>(
      (error, validator) => error || validator(value),
      undefined
    );
}

type ValidatorSpec = string | [string, (string | number)[]];

export function validate(names: ValidatorSpec[]): ValidatorFn {
  return composeValidators(
    ...names.map((n) => {
      const [name, args] = typeof n === "string" ? [n, []] : n;
      switch (name) {
        case "required":
          return required(...(args as [string?]));
        case "email":
          return isEmail();
        case "greater":
          return isGreater(args[0] as number);
        default:
          return () => undefined;
      }
    })
  );
}
