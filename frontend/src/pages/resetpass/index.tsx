import React from 'react';
import styles from './index.module.scss';

const ExportPassword = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h3>Reset Password</h3>
        <input className={styles.reset} type="text" name="email" placeholder="Enter your email" />
      </div>
    </div>
  );
};

export default ExportPassword;
