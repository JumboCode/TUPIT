import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import { useForm } from 'react-hook-form';
import AuthBox from '@/components/authbox';
import styles from './index.module.scss';

const LoginForm = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isLoggedIn) router.push('/');
  }, [isLoggedIn]);

  /*
   * @param {Object} data - Key corresponds to the name registered for input
   * @param {Event}  e
   */
  const onSubmitSuccess = (data, e) => {
    e.preventDefault();
    login(data.username, data.password).then(
      () => router.push('/'),
      (err) => alert(err)
    );
  };

  const onSubmitError = (e) => {
    Object.keys(e).forEach((key) => {
      console.log(e[key].message);
    });
  };

  const resetPass = (e) => router.push('/resetpass');

  return (
    <AuthBox>
      <h3>Login</h3>
      <form className={styles.form} onSubmit={handleSubmit(onSubmitSuccess, onSubmitError)}>
        <label htmlFor='username'></label>
        <input
          id='username'
          type="text"
          placeholder="Enter your username"
          {...register('username', {
            required: {
              value: true,
              message: 'Username must not be empty',
            },
          })}
        />
        {errors.username && <p>{errors.username.message}</p>}
        <label htmlFor='password'></label>
        <input
          id='password'
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          {...register('password', {
            required: {
              value: true,
              message: 'Password must not be empty',
            },
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <label className={styles.passwordContainer}>
          <input
            type="checkbox"
            id={styles.checkBox}
            checked={showPassword}
            onClick={() => setShowPassword(!showPassword)}
          />
          <div className={styles.showPasswordText}>Show Password</div>
        </label>
        <div className={styles.forgotPasswordContainer}>
          <a className={styles.forgotPassword} onClick={resetPass}>
            Forgot your password?{' '}
          </a>
          <button type="submit">Next</button>
        </div>
      </form>
    </AuthBox>
  );
};

export default LoginForm;
