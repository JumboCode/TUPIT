import React from 'react';
import styles from './index.module.scss';

const ExportResetPassword = () => {

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/reset-password/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: e.target.email.value
      })
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h3>Reset Password</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.wrapper}>
            <div className={styles.row}>
              <label htmlFor="email">
                <input
                  id="email"
                  className={styles.reset}
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                />
              </label>
            </div>
            <div className={styles.row}>
              <label htmlFor="newpassword">
                <input
                  id="newpassword"
                  className={styles.reset}
                  type="text"
                  name="newpassword"
                  placeholder="Enter your new password"
                />
              </label>
            </div>
          </div>
          <div className={styles.rowReverse}>
            <button type="submit">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportResetPassword;
