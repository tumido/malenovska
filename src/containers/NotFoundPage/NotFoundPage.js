/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Logo } from 'components';

import './style.scss';

const NotFound = ({ text }) => {
  const displayText = text || "Tak tato stránka tu fakt není. Zkus menu vlevo!"

  return (
    <section className="NotFoundPage custom-font">
      <div className="logo">
        <Logo />
      </div>
      <h1>{displayText}</h1>
    </section>
  );
}

NotFound.propTypes = {
  text: PropTypes.string,
}

export default NotFound;
