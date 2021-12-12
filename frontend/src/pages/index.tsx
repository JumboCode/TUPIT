import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/auth';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Home: React.FC = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
      {isLoggedIn ? (
        <input type="button" onClick={() => router.push('/logout')} value="Logout" />
      ) : (
        <input type="button" onClick={() => router.push('/login')} value="Login" />
      )}
      <br />
      {isLoggedIn ? (
        <input type="button" onClick={() => router.push('/ChangePass')} value="Change Password" />
      ) : (
        ''
      )}
    </div>
  );
};

export default Home;
