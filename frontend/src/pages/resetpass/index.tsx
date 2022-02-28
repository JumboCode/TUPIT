import React from 'react';
import styles from './index.module.scss';

const ExportPassword = () => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h3>Reset Password</h3>
        <form>
            <label htmlFor="email">
                <input id="email" className={styles.reset} type="text" 
                name="email" placeholder="Enter your email" />
            </label>
            <label htmlFor="newpassword">
                <input id="newpassword" className={styles.reset} type="text" 
                name="newpassword" placeholder="Enter your new password" />
            </label>
        </form> 
        <div className={styles.buttonReverse}>
            <button type="button">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ExportPassword;
