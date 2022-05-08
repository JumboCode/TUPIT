import React from 'react';
import styles from './authbox.module.scss';

interface AuthBoxInterface {
  children: JSX.Element[];
};

/*
 * Generic centered-box grid for input forms.
 */
const AuthBox = (props: AuthBoxInterface) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        {props.children}
      </div>
    </div>
  );
};

export default AuthBox;
