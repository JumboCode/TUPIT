import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useAuth } from '../components/auth';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Home: React.FC = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();

  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
    </div>
  );
};

export default Home;
