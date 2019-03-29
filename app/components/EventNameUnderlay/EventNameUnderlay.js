import React from 'react';
import './style.scss';
import { header } from 'change-case';

const EventNameUnderlay = ({title}) => (
  <header className="event-name-top custom-font">
    <h1>{title}</h1>
  </header>
);



export default EventNameUnderlay;
