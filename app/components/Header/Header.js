import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { push as Menu } from 'react-burger-menu';
import {decorator as reduxBurgerMenu, action as toggleMenu} from 'redux-burger-menu';
import Logo from 'components/Logo';
import './style.scss';

const Header = props => {
  return (
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
      <Link onClick={() => {props.toggleMenu(false)}} to="/" className="bm-item__logo">
        <Logo />
      </Link>
      <Link onClick={() => {props.toggleMenu(false)}} className="router-link custom-font" to="/bitva/legends">
        <i className="fas fa-book-open"></i>Zprávy z bojiště
      </Link>
      <Link onClick={() => {props.toggleMenu(false)}} className="router-link custom-font" to="/bitva/rules">
        <i className="fas fa-balance-scale"></i> Pravidla střetu
      </Link>
      <Link onClick={() => {props.toggleMenu(false)}} className="router-link custom-font" to="/bitva/info">
        <i className="fas fa-map-marker-alt"></i> Důležité informace
      </Link>
      <Link onClick={() => {props.toggleMenu(false)}} className="router-link custom-font bm-item--highlight" to="/bitva/registration">
        <i className="fas fa-address-card"></i>Registrace
      </Link>
    </Menu>
  )
};

const mapDispatchToProps = {
  toggleMenu,
}

export default connect(null, mapDispatchToProps)(reduxBurgerMenu(Header));
