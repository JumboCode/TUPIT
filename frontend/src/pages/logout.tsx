import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useAuth } from '../components/auth';

export default function LogoutForm() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();

  useEffect(() => {
    logout().then(
      (res) => Router.push('/'),
      (err) => alert(err)
    );
  }, []);

  return <div>Logging out...</div>;
}
