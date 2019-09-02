import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Menu from 'react-burger-menu/lib/menus/slide';
import { decorator as reduxBurgerMenu, action as toggleMenu } from 'redux-burger-menu';

import Logo from 'components/Logo';
import EventNameOverlay from 'components/EventNameOverlay';
import { EventPropType } from 'utilities/scheme';

import './style.scss';

const Header = ({ event, toggleMenu, ...props }) => {
  const close = () => {toggleMenu(false);};

  return (
    <div className="Header">
      <Helmet><title>{event.name} {event.year}</title></Helmet>
      <Menu
        pageWrapId={ 'app-content' }
        outerContainerId={ 'app-wrapper' }
        { ...props }
      >
        <NavLink onClick={ close } to="/" className="bm-item__logo">
          <Logo />
        </NavLink>
        <NavLink onClick={ close } className="router-link custom-font" to='legends' activeClassName="bm-item--highlight">
          <i className="fas fa-book-open"></i>Zprávy z bojiště
        </NavLink>
        <NavLink onClick={ close } className="router-link custom-font" to='rules' activeClassName="bm-item--highlight">
          <i className="fas fa-balance-scale"></i> Pravidla střetu
        </NavLink>
        <NavLink onClick={ close } className="router-link custom-font" to='info' activeClassName="bm-item--highlight">
          <i className="fas fa-map-marker-alt"></i> Důležité informace
        </NavLink>
        <NavLink onClick={ close } className="router-link custom-font" to='registration' activeClassName="bm-item--highlight">
          <i className="fas fa-address-card"></i>Registrace
        </NavLink>
        <NavLink onClick={ close } className="router-link custom-font margin-top" to="/">
          <i className="fas fa-map-signs"></i>Úvodní stránka
        </NavLink>
      </Menu>
      <EventNameOverlay title={ event.name }/>
    </div>
  );
};

Header.propTypes = {
  event: EventPropType,
  toggleMenu: PropTypes.func.isRequired
}

export default compose(
  connect(null, { toggleMenu })
)(reduxBurgerMenu(Header));
