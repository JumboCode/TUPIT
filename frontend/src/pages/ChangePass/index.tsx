import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './index.module.scss';
import AuthBox from '../../components/authbox';

const ChangePass = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  async function doChangePass(e) {
    e.preventDefault();

    var old_p = e.target.old_password.value;
    var new_p = e.target.new_password.value;
    var new_p_confirm = e.target.new_password_confirm.value;

    // TODO: More robust form validation. This was just quick and easy.
    if (new_p != new_p_confirm) {
      alert('Passwords must match');
      return;
    }

    const res = await fetch('http://127.0.0.1:8000/change-password/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        old_password: old_p,
        new_password: new_p,
      }),
    }).catch((err) => {
      console.log(err);
      alert('Error connecting to server');
    });

    if (res)
      if (res.ok) {
        alert('Successfully changed password');
        router.push('/');
      } else alert('Password was incorrect');
  }

  /* @TODO fix password input styling */
  const content: JSX.Element[] = [
    (<label htmlFor='oldPassword'>
      <input id='oldPassword'
       type='password'
       name='old_password'
       placeholder='Enter your old password'
       required/>
    </label>),
    (<label htmlFor='newPassword'>
      <input id='newPassword'
       type='password'
       name='new_password'
       placeholder='Enter your new password'
       required/>
    </label>),
    (<label htmlFor='new_password_confirm'>
      <input id='new_password_confirm'
       type='password'
       name='new_password_confirm'
       placeholder='Confirm your password'
       required/>
    </label>)
  ];

  return (
    <AuthBox header={'Change Password'}
     callback={doChangePass}
     content={content}
     navigate={'Next'} />
  );
};

export default ChangePass;