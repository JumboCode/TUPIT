import React from 'react';

// Import styles
import styles from './navbar.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

type NavbarProps = {
  children?: React.ReactNode;
};

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <>
      <div className={cx('navbar-container')}>
        <div className={cx('navbar-title')}>TUPIT</div>

        <span className={cx('navbar-hamburger')}>
          <i className={cx('fa fa-bars')}></i>
        </span>
      </div>
      <div className={cx('navbar-menu')}>
        <div className={cx('navbar-menu-item')}> Jackson </div>
        <div className={cx('navbar-menu-item')}> Tyler </div>
      </div>
      {children}
    </>
  );
};

export default Navbar;
