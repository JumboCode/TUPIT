import React, { useEffect, useState } from 'react';
import Router from 'next/router';

export default function LoginForm() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Get CSRF token
    fetch('http://127.0.0.1:8000/get-csrf-token/', { credentials: 'include' })
      .catch((err) => console.log(err))
      .then((res) => setCsrfToken(res.headers.get('X-CSRFToken')));
  }, []);

  function login(e) {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    })
      .catch((err) => {
        console.log(err);
      })
      .then((res) => {
        if (res.status === 200) Router.push('/');
        else {
          alert('Invalid credentials');
        }
      });
  }

  return (
    <form onSubmit={login}>
      <input type="text" name="username" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
  );
}
