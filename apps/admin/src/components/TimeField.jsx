import React from "react";
import PropTypes from "prop-types";
import format from "date-fns/format";

const TimeField = ({ source, record = {} }) => (
  <span>{record && record[source] && format(record[source], "HH:mm")}</span>
);

TimeField.propTypes = {
  label: PropTypes.string,
  record: PropTypes.objectOf(PropTypes.instanceOf(Date)),
  source: PropTypes.string.isRequired,
};

TimeField.defaultProps = {
  addLabel: true,
};

export default TimeField;
