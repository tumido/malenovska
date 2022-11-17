import React from "react";
import format from "date-fns/format";
import { Labeled, useRecordContext } from 'react-admin';

const TimeField = (props) => {
  const record = useRecordContext(props);

  return (
    <Labeled label={props.label}>
      <span>{record && record[props.source] && format(record[props.source], "HH:mm")}</span>
    </Labeled>
  )
}

export default TimeField;
