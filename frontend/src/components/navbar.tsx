import React from 'react';

// Import styles
import styles from './navbar.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

type NavbarProps = {
  children?: React.ReactNode;
  links?: string[];
  hidden?: boolean;
};

const defaultLinks = ['Tyler', 'Jackson', 'Michael', 'Sarah', 'Skylar'];

const Navbar: React.FC<NavbarProps> = ({ children, links, hidden }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  return (
    <>
      {hidden == undefined || !hidden ? (
        <>
          <div className={cx('navbar-container')}>
            <div className={cx('navbar-title')}>TUPIT</div>

            <span className={cx('navbar-hamburger')} onClick={() => setMenuVisible(!menuVisible)}>
              <i className={cx('fa fa-bars')}></i>
            </span>
          </div>
          <div className={cx(menuVisible ? 'navbar-menu' : 'navbar-menu-invisible')}>
            {(links == undefined ? defaultLinks : links).map((link, index) => (
              <div key={index} className={cx('navbar-menu-item')}>
                {link}
              </div>
            ))}
          </div>
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default Navbar;
