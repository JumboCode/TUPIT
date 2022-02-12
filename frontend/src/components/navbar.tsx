import React, { useEffect } from 'react';
import Link from 'next/link';

// Import styles
import styles from './navbar.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from './auth';
import router from 'next/router';
const cx = classNames.bind(styles);

type NavbarProps = {
  children?: React.ReactNode;
  links?: HamburgerLink[];
  hidden?: boolean;
};

export type HamburgerLink = {
  display: string;
  location: string;
};

const Navbar: React.FC<NavbarProps> = ({ children, links, hidden }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const auth = useAuth();

  const defaultLinks: HamburgerLink[] = auth.isLoggedIn
    ? [
        {
          display: 'Classes',
          location: '/class',
        },
        {
          display: 'Students',
          location: '/student',
        },
        {
          display: 'Degrees',
          location: '/degree',
        },
        {
          display: 'Logout',
          location: '/logout',
        },
      ]
    : [
        {
          display: 'Login',
          location: '/login',
        },
      ];

  return (
    <>
      {hidden == undefined || !hidden ? (
        <>
          <div className={cx('navbar-container')}>
            <Link href="/">
              <div className={cx('navbar-title')}>TUPIT</div>
            </Link>
            {defaultLinks.map((link, index) => (
              <Link href={link.location} key={index}>
                <div className={cx('navbar-link')}>{link.display}</div>
              </Link>
            ))}

            <span className={cx('navbar-hamburger')} onClick={() => setMenuVisible(!menuVisible)}>
              <i className={cx('fa fa-bars')}></i>
            </span>

            {menuVisible && (
              <div className={cx('close-menu-area')} onClick={() => setMenuVisible(false)}></div>
            )}
            <div className={cx(menuVisible ? 'navbar-menu' : 'navbar-menu-invisible')}>
              {(links == undefined ? defaultLinks : links).map((link, index) => (
                <Link href={link.location} key={index}>
                  <span className={cx('navbar-menu-item')}>{link.display}</span>
                </Link>
              ))}
            </div>
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
