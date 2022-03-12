import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './index.module.scss';

export default function LoginForm() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [isLoggedIn]);

  function doLogin(e) {
    e.preventDefault();
    login(e.target.username.value, e.target.password.value).then(
      () => router.push('/'),
      (err) => alert(err)
    );
  }

  function resetPass(e) {
    router.push('/resetpass');
  }

  return (
    <div className={styles.container}>
      <h1>Welcome to TUPIT!</h1>
      <form className={styles.box} className={styles.loginForm} onSubmit={doLogin}>
        <p>Username: </p>
        <input className={styles.textField} type="text" name="username" />
        <p>Password: </p>
        <input className={styles.textField} type="password" name="password" />
        <div className={styles.submitContainer}>
          <a className={styles.reset} onClick={resetPass}>
            Forgot your password?{' '}
          </a>
          <input className={styles.submit} type="submit" value="Login" />
        </div>
      </form>
    </div>
  );
}
