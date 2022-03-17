import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from "@/components/auth";
import AuthBox from "@/components/authbox";
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
  
  const content = [
    (<label htmlFor='username'>
      <input id='username'
       type='text'
       name='username' 
       placeholder='Enter your username'
      />
    </label>),
    (<label htmlFor='password'>
      <input id='password' 
       type='password'
       name='password'
       placeholder='Enter your password'
      />
    </label>),
    (<a onClick={resetPass}>
      Forgot your password?{' '}
    </a>)
  ];
  return (
    <AuthBox header={'Login'}
     callback={doLogin}
     content={content}
     navigate={'Next'}/>
  ); 
}
