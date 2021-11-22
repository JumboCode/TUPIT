import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useAuth } from '../components/auth';

export default function ChangePass() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();

  useEffect(() => {
    if (isLoggedIn == false) Router.push('/');
  }, []);

  function doChangePass(e) {
    e.preventDefault();

    var old_p = e.target.old_password.value;
    var new_p = e.target.new_password.value;
    var new_p_confirm = e.target.new_password_confirm.value;

    // TODO: More robust form validation. This was just quick and easy.
    if (new_p != new_p_confirm) alert('Passwords must match');
    else if (new_p == '') alert('Password cannot be blank');
    else
      fetch('http://127.0.0.1:8000/change-password/', {
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
      })
        .then((res) => {
          if (res.ok) {
            alert('Successfully changed password');
            Router.push('/');
          } else {
            alert('Password was incorrect');
          }
        })
        .catch((err) => {
          console.log(err);
          alert('Error connecting to server');
        });
  }

  return (
    <div>
      <form onSubmit={doChangePass}>
        <input type="password" name="old_password" placeholder="Current Password" />
        <input type="password" name="new_password" placeholder="New Password" />
        <input type="password" name="new_password_confirm" placeholder="Confirm new Password" />
        <input type="submit" />
      </form>
    </div>
  );
}
