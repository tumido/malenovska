import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import Menu from 'react-burger-menu/lib/menus/slide';
import {decorator as reduxBurgerMenu, action as toggleMenu} from 'redux-burger-menu';
import get from 'lodash/get'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'

import Logo from 'components/Logo';
import EventNameOverlay from 'components/EventNameOverlay';
import { EventPropType } from 'propTypes';

import './style.scss';

const Header = ({event, location, toggleMenu, ...props}) => {
  const base = location.pathname.split('/', 2).join('/')
  const close = () => {toggleMenu(false)}
  const title = !isLoaded(event) ? 'Načítám...' : `${event.title} ${event.year}`

  return (
    <div className="Header">
      <Helmet><title>{title}</title></Helmet>
      <Menu
        pageWrapId={ "app-content" }
        outerContainerId={ "app-wrapper" }
        customBurgerIcon={
          <span>
            <span className="bm-burger-bars"></span><span className="bm-burger-bars"></span><span className="bm-burger-bars"></span>
          </span>
        }
        {...props}
      >
        <NavLink onClick={close} to="/" className="bm-item__logo">
          <Logo />
        </NavLink>
        <NavLink onClick={close} className="router-link custom-font" to={base + "/legends"} activeClassName="bm-item--highlight">
          <i className="fas fa-book-open"></i>Zprávy z bojiště
        </NavLink>
        <NavLink onClick={close} className="router-link custom-font" to={base + "/rules"} activeClassName="bm-item--highlight">
          <i className="fas fa-balance-scale"></i> Pravidla střetu
        </NavLink>
        <NavLink onClick={close} className="router-link custom-font" to={base + "/info"} activeClassName="bm-item--highlight">
          <i className="fas fa-map-marker-alt"></i> Důležité informace
        </NavLink>
        <NavLink onClick={close} className="router-link custom-font" to={base + "/registration"} activeClassName="bm-item--highlight">
          <i className="fas fa-address-card"></i>Registrace
        </NavLink>
        <NavLink onClick={close} className="router-link custom-font margin-top" to="/">
          <i className="fas fa-map-signs"></i>Úvodní stránka
        </NavLink>
      </Menu>
      <EventNameOverlay title={title}/>
    </div>
  )
};

const mapDispatchToProps = {
  toggleMenu,
}

const mapStateToProps = (state, props) => ({
  event: get(state.firestore.data, `events.${props.location.pathname.split("/")[1]}`),
})

Header.propTypes = {
  event: EventPropType,
  location: PropTypes.object.isRequired,
  toggleMenu: PropTypes.func.isRequired
}

export default compose(
  firestoreConnect(({location: { pathname }}) => ([
    `events${pathname.split("/",2).join("/")}`
  ])),
  connect(mapStateToProps, mapDispatchToProps)
)(reduxBurgerMenu(Header));
