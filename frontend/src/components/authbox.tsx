import React from 'react';
import Link from 'next/link';

import styles from './authbox.module.scss';
const cx = classNames.bind(styles);

interface AuthBoxInterface {
  header: string;
  handleCallBack: (e) => void;
  // content:
}

const AuthBox = (props: AuthBoxInterface) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.box}>
          <h3>{props.header}</h3>
          <form onSubmit={props.handleCallBack}>
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
                <div className={styles.second}></div>
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
    </>
  );
};

export const AuthBox;
