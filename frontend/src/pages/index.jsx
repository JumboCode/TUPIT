import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useAuth } from '../components/auth';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Home() {
  const { isLoggedIn, csrfToken, ready: authReady, login, logout, identity } = useAuth();

  function getAccountButton() {
    if (isLoggedIn == true) return <button onClick={logout}>Logout</button>;
    else if (isLoggedIn == false)
      return <button onClick={() => Router.push('loginform')}>Login</button>;
    return <button>...</button>;
  }

  function getStudents() {
    fetch('http://127.0.0.1:8000/api/course/', { credentials: 'include' }).then((res) => {
      res.json().then((data) => {
        console.log(data);
      });
    });
  }
  getStudents();

  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
      {getAccountButton()}
    </div>
  );
}
