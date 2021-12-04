import React from 'react';
import Link from 'next/link';

// Import styles
import styles from './navbar.module.scss';
import classNames from 'classnames/bind';
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

const defaultLinks = [
  {
    display: 'Link 1',
    location: '/link1',
  },
  {
    display: 'Link 2',
    location: '/link2',
  },
];

const Navbar: React.FC<NavbarProps> = ({ children, links, hidden }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  return (
    <>
      {hidden == undefined || !hidden ? (
        <>
          <div className={cx('navbar-container')}>
            <span className={cx('navbar-title')}>TUPIT</span>
            <span className={cx('navbar-link')}>Classes</span>
            <span className={cx('navbar-link')}>Students</span>

            <span className={cx('navbar-hamburger')} onClick={() => setMenuVisible(!menuVisible)}>
              <i className={cx('fa fa-bars')}></i>
            </span>
          </div>
          <div className={cx(menuVisible ? 'navbar-menu' : 'navbar-menu-invisible')}>
            {(links == undefined ? defaultLinks : links).map((link, index) => (
              <div key={index} className={cx('navbar-menu-item')}>
                <Link href={link.location}>{link.display}</Link>
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
