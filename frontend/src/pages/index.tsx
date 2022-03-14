import React, { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/auth';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Home: React.FC = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  const cohort = createRef<HTMLInputElement>();
  const course = createRef<HTMLInputElement>();

  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
      {isLoggedIn ? (
        <input type="button" onClick={() => router.push('/logout')} value="Logout" />
      ) : (
        <input type="button" onClick={() => router.push('/login')} value="Login" />
      )}
      <br />
      {isLoggedIn ? (
        <input type="button" onClick={() => router.push('/ChangePass')} value="Change Password" />
      ) : (
        ''
      )}
      <form onSubmit={() => router.push(`/student/?cohortInit=${cohort.current.value}`)}>
        <input type="number" ref={cohort} min={0} onWheel={(e) => e.currentTarget.blur()} />
        <input type="submit" value="Search" />
      </form>
      <form onSubmit={() => router.push(`/class/?courseTitleInit=${course.current.value}`)}>
        <input type="string" ref={course} />
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default Home;
