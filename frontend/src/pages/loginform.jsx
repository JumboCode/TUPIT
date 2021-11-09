import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useAuth } from '../components/auth';

export default function LoginForm() {
  const { isLoggedIn, ready: authReady, login, logout, identity } = useAuth();

  function doLogin(e) {
    e.preventDefault();
    login(e.target.username.value, e.target.password.value).then(
      () => Router.push('/'),
      (err) => alert(err)
    );
  }

  if (isLoggedIn) Router.push('/');

  return (
    <div>
      <form onSubmit={doLogin}>
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
