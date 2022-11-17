import React from "react";
import {
  DateField,
  useLocaleState
} from "react-admin";


export const LocaleDateField = (props) => {
  const [locale] = useLocaleState();

  return <DateField {...props} locales={locale} />;
};
