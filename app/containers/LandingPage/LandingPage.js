import React from 'react';
import { Helmet } from 'react-helmet';
import './style.scss';
import Logo from 'components/Logo';

const LandingPage = () => (
  <article>
    <Helmet>
      <title>Úvod</title>
      <meta name="description" content="Vyber si Malenovskou, která tě zajímá" />
    </Helmet>
    <section className="logo">
      <Logo />
    </section>
    <section>
      Malenovská bude
    </section>
  </article>
);

export default LandingPage;
