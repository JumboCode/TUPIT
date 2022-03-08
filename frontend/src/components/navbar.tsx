import React, { useEffect } from 'react';
import Link from 'next/link';

// Import styles
import styles from './navbar.module.scss';
import classNames from 'classnames/bind';
import { useAuth } from './auth';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const defaultLinks: HamburgerLink[] = auth.isLoggedIn
    ? [
        {
          display: 'CLASSES',
          location: '/class',
        },
        {
          display: 'STUDENTS',
          location: '/student',
        },
        {
          display: 'DEGREES',
          location: '/degree',
        },
        {
          display: 'LOGOUT',
          location: '/logout',
        },
      ]
    : [
        {
          display: 'LOGIN',
          location: '/login',
        },
      ];

  const handleMenuClick = (route) => {
    setMenuVisible(false);
    router.push(route);
  };

  const menuClasses = cx({
    'navbar-menu': true,
    invisible: !menuVisible,
  });

  return (
    <>
      {hidden == undefined || !hidden ? (
        <>
          <div className={cx('navbar-container')}>
            <Link href="/">
              <div className={cx('title-container')}>
                <div className={cx('navbar-title')}>TUPIT</div>
              </div>
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
            <div className={menuClasses}>
              {(links == undefined ? defaultLinks : links).map((link, index) => (
                <div
                  className={cx('navbar-menu-item')}
                  key={index}
                  onClick={() => handleMenuClick(link.location)}
                >
                  {link.display}
                </div>
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
