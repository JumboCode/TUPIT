import React from 'react';
import styles from './authbox.module.scss';

interface AuthBoxInterface {
  header: string;
  callback: (e) => void;
  content: JSX.Element[];
  navigate: string;
}

/*
 * Used for login and password changing page.
 */
const AuthBox = (props: AuthBoxInterface) => {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h3>{props.header}</h3>
        <form onSubmit={props.callback}>
          <div className={styles.wrapper}>
            {props.content.map((x: JSX.Element) => (
              <div className={styles.row}>{x}</div>
            ))}
          </div>
          <div className={styles.rowReverse}>
            <button type="submit">{props.navigate}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthBox;
