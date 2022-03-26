import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import { useForm } from 'react-hook-form';
import AuthBox from '@/components/authbox';

const LoginForm = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }} = useForm();

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
  }

  const onSubmitError = (e) => {
    Object.keys(e).forEach((key) => {
      console.log(e[key].message);
    });
  }

  const resetPass = (e) => router.push('/resetpass');
  
  return (
    <AuthBox>
      <h3>Login</h3>
      <form onSubmit={handleSubmit(onSubmitSuccess, onSubmitError)}>
        <input type='text' placeholder='Enter your username'
          {...register('username', {
            required: {
              value: true,
              message: 'Username must not be empty'
            },
          })}/>
        {errors.username && <p>{errors.username.message}</p>}
        <input type='password' placeholder='Enter your password'
         {...register('password', {
           required: {
             value: true,
             message: 'Password must not be empty'
           }
         })}/>
         {errors.password && <p>{errors.password.message}</p>}
        <a onClick={resetPass}>Forgot your password?{' '}</a>
        <button type='submit'>Next</button>
      </form>
    </AuthBox>
  ); 
};

export default LoginForm;