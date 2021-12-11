import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/auth';

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

  return (
    <div>
      <form onSubmit={doLogin}>
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}
