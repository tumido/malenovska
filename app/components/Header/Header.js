import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Menu from 'react-burger-menu/lib/menus/push';
import {decorator as reduxBurgerMenu, action as toggleMenu} from 'redux-burger-menu';
import Logo from 'components/Logo';
import './style.scss';

const Header = props => {
  const base = props.location.pathname.split('/', 2).join('/')
  const close = () => {props.toggleMenu(false)}

  return (
    <div>
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
    </div>
  )
};

const mapDispatchToProps = {
  toggleMenu,
}

export default connect(null, mapDispatchToProps)(reduxBurgerMenu(Header));
