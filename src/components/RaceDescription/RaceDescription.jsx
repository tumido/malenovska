import React from 'react';
import PropTypes from 'prop-types';
import { RacePropType } from 'utilities/scheme';

import { Markdown } from 'components';

import './style.scss';

const RaceDescription = ({race, component}) => {
  const ComponentToRender = component;
  return (
    <ComponentToRender className="RaceDescription">
      <Markdown className="custom-font" content={ race.legend } />
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

