import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import AuthBox from '@/components/authbox';
import styles from './index.module.scss';

export default function LoginForm() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

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

  const content = [
    <label htmlFor="username">
      <input id="username" type="text" name="username" placeholder="Enter your username" />
    </label>,
    <label htmlFor="password">
      <input
        id="password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        placeholder="Enter your password"
      />
    </label>,
    <label className={styles.showPassword}>
      <input
        type="checkbox"
        checked={showPassword}
        onClick={() => setShowPassword(!showPassword)}
      />
      <div>Show Password</div>
    </label>,
    <a onClick={resetPass}>Forgot your password? </a>,
  ];
  return <AuthBox header={'Login'} callback={doLogin} content={content} navigate={'Next'} />;
}
