/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import Logo from 'components/Logo';
import './style.scss';

export default function NotFound() {
  return (
    <section className="NotFoundPage custom-font">
      <div className="logo">
        <Logo />
      </div>
      <h1>Tak tato stránka tu fakt není. Zkus menu vlevo!</h1>
    </section>
  );
}
