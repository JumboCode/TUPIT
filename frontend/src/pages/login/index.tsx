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

  // return (
  //   <div className={styles.container}>
  //     <form className={styles.loginForm} onSubmit={doLogin}>
  //       <div className={styles.signInTitle}>Sign in</div>
  //       <input
  //         className={styles.textField}
  //         type="text"
  //         name="username"
  //         placeholder="Enter your username"
  //       />
  //       <input
  //         className={styles.textField}
  //         type={showPassword ? 'text' : 'password'}
  //         name="password"
  //         placeholder="Enter your password"
  //       />
  //       <label className={styles.showPassword}>
  //         <input
  //           type="checkbox"
  //           checked={showPassword}
  //           onClick={() => setShowPassword(!showPassword)}
  //         />
  //         <>Show Password</>
  //       </label>
  //       <div className={styles.submitContainer}>
  //         <p className={styles.forgotPasswordText}>Forgot password?</p>
  //         <input className={styles.btn} type="submit" value="Next" />
  //       </div>
  //     </form>
  //   </div>
  // );

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
