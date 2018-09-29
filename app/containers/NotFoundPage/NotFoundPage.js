/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react';
import Article from 'components/Article';
import LoadingIndicator from 'components/LoadingIndicator';
import './style.scss';

export default function NotFound() {
  return (
    <Article title="Stránka neexistuje" />
  );
}
