import { checkPropTypes } from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';

export const AuthContext = React.createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Get and store CSRF token
    fetch('http://127.0.0.1:8000/get-csrf-token/', { credentials: 'include' })
      .then((res) => setCsrfToken(res.headers.get('X-CSRFToken')))
      .catch((err) => console.log(err));

    // Check if user is logged in and set isLoggedIn state
    checkAuth().then(
      (res) => setIsLoggedIn(res),
      (err) => console.log(err)
    );
  }, [isLoggedIn]);

  const login = (username, password) =>
    new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            setIsLoggedIn(true);
            resolve('Successfully logged in');
          } else {
            setIsLoggedIn(false);
            reject('Invalid credentials');
          }
        })
        .catch((err) => {
          console.log(err);
          reject('Error connecting to backend');
        });
    });

  const checkError = (error) => Promise.resolve();

  const checkAuth = () =>
    new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8000/validate-logged-in/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((res) => {
          res.json().then((data) => {
            if (data.is_logged_in) resolve(true);
            else resolve(false);
          });
        })
        .catch((err) => {
          console.log(err);
          reject('Error connecting to backend');
        });
    });

  const logout = () =>
    new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8000/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((res) => {
          if (res.status === 200) {
            setIsLoggedIn(false);
            resolve('Successfully logged out');
          } else reject('Not logged in');
        })
        .catch((err) => {
          console.log(err);
          reject('Error connecting to backend');
        });
    });

  const getIdentity = () => Promise.resolve();

  const getPermissions = (params) => Promise.resolve();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        csrfToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
