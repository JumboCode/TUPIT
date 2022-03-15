import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthBox from '../../components/authbox';
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

  
  // return (
  //   <div className={styles.container}>
  //     <h1>Welcome to TUPIT!</h1>
  //     <form className={styles.box} className={styles.loginForm} onSubmit={doLogin}>
  //       <p>Username: </p>
  //       <input className={styles.textField} type="text" name="username" />
  //       <p>Password: </p>
  //       <input className={styles.textField} type="password" name="password" />
  //       <div className={styles.submitContainer}>
  //         <a className={styles.reset} onClick={resetPass}>
  //           Forgot your password?{' '}
  //         </a>
  //         <input className={styles.submit} type="submit" value="Login" />
  //       </div>
  //     </form>
  //   </div>
  // );
}
