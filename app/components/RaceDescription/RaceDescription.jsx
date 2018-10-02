import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import './style.scss';

const RaceDescription = ({race, component}) => {
  const ComponentToRender = component;
  return (
    <ComponentToRender className="RaceDescription">
      <ReactMarkdown className="custom-font" source={ race.legend.replace(/\\n/g,'\n') } />
      <hr />
      <p className="custom-font">{ race.description }</p>
    </ComponentToRender>
  )
};

RaceDescription.propTypes = {
  race: PropTypes.object.isRequired,
  component: PropTypes.string.isRequired
};

RaceDescription.defaultProps = {
  race: {
    legend: "",
    description: ""
  },
  component: 'div'
}

export default RaceDescription;

