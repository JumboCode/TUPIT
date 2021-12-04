import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';

export const AuthContext = React.createContext({
  isLoggedIn: false,
  csrfToken: '',
  login: async (username, password): Promise<void> => {
    return new Promise((resolve, reject) => reject());
  },
  logout: async (): Promise<void> => {
    return new Promise((resolve, reject) => reject());
  },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');

  const router = useRouter();

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

    if (isLoggedIn == false) router.push('/login');
  }, [isLoggedIn]);

  const login = async (username: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
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
            resolve();
          } else {
            setIsLoggedIn(false);
            reject('Invalid login credentials');
          }
        })
        .catch((err) => {
          console.log(err);
          reject('Error connecting to server');
        });
    });
  };

  const checkAuth = async (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8000/validate-logged-in/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((res) => {
          res.json().then((data) => {
            resolve(data.is_logged_in);
          });
        })
        .catch((err) => {
          console.log(err);
          reject('Error connecting to server');
        });
    });
  };

  const logout = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      fetch('http://127.0.0.1:8000/logout/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((res) => {
          setIsLoggedIn(false);
          resolve();
        })
        .catch((err) => {
          console.log(err);
          reject('Error connecting to server');
        });
    });
  };

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
};

export default AuthProvider;
