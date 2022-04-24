import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';

export default function LogoutForm() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    logout().then(
      (res) => router.push('/'),
      (err) => alert(err)
    );
  }, []);

  return <div>Logging out...</div>;
}
