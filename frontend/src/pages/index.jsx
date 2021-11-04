import React, { useEffect, useState } from 'react';
import Router from 'next/router';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Home() {
  const [csrfToken, setCsrfToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    // Get CSRF token
    fetch('http://127.0.0.1:8000/get-csrf-token/', { credentials: 'include' })
      .catch((err) => console.log(err))
      .then((res) => setCsrfToken(res.headers.get('X-CSRFToken')));

    fetchIsLoggedIn();
  }, []);

  async function logout(e) {
    e.preventDefault();
    const res = await fetch('http://127.0.0.1:8000/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    }).catch((err) => console.log(err));

    const data = await res.json();
    console.log(data.info);
    fetchIsLoggedIn();
  }

  function fetchIsLoggedIn() {
    fetch('http://127.0.0.1:8000/validate-logged-in/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        res.json().then((data) => setIsLoggedIn(data.is_logged_in));
      });
  }

  function getAccountButton() {
    if (isLoggedIn == true) return <button onClick={logout}>Logout</button>;
    else if (isLoggedIn == false)
      return <button onClick={() => Router.push('loginform')}>Login</button>;
    return <h2>...</h2>;
  }

  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
      {getAccountButton()}
    </div>
  );
}
