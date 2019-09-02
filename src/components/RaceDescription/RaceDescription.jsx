import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { RacePropType } from 'utilities/scheme';

import './style.scss';

const RaceDescription = ({race, component}) => {
  const ComponentToRender = component;
  return (
    <ComponentToRender className="RaceDescription">
      <ReactMarkdown className="custom-font" source={ race.legend.replace(/\\n/g,'\n') } />
      <p className="custom-font"><strong>{ race.description }</strong></p>
    </ComponentToRender>
  )
};

RaceDescription.propTypes = {
  race: RacePropType,
  component: PropTypes.string.isRequired
};

RaceDescription.defaultProps = {
  race: {
    legend: "",
    description: "",
    event: 'bitva'
  },
  component: 'div'
}

export default RaceDescription;

