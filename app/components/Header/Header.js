import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Menu from 'react-burger-menu/lib/menus/slide';
import {decorator as reduxBurgerMenu, action as toggleMenu} from 'redux-burger-menu';
import get from 'lodash/get'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'

import Logo from 'components/Logo';
import EventNameUnderlay from 'components/EventNameUnderlay';

import './style.scss';

const Header = props => {
  const base = props.location.pathname.split('/', 2).join('/')
  const close = () => {props.toggleMenu(false)}
  const title = !isLoaded(props.event) ? 'Načítám...' : `Malenovská ${props.event.title} ${props.event.year}`

  return (
    <div>
      <Helmet><title>{title}</title></Helmet>
      <div className="nav-wrapper">
        <Menu
          isOpen={window.innerWidth > 768}
          noOverlay={true}
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
        <EventNameUnderlay title={title}/>
      </div>
    </div>
  )
};

const mapDispatchToProps = {
  toggleMenu,
}

const mapStateToProps = (state, props) => ({
  event: get(state.firestore.data, `events.${props.location.pathname.split("/")[1]}`),
})

export default compose(
  firestoreConnect(({location: { pathname }}) => ([
    `events${pathname.split("/",2).join("/")}`
  ])),
  connect(mapStateToProps, mapDispatchToProps)
)(reduxBurgerMenu(Header));
