import React, { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';

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
      <div className={cx('dashboard')}>
        <h1>TUPIT Dashboard</h1>
        {isLoggedIn ? null : (
          <input type="button" onClick={() => router.push('/login')} value="Login" />
        )}
        <br />
        {isLoggedIn ? (
          <div className={cx('dashboard_content')}>
            <div>
              <h2>Cohort Search</h2>
              <form
                className={cx('search_field')}
                onSubmit={() => router.push(`/student/?cohortInit=${cohort.current.value}`)}
              >
                <input
                  className={cx('text_field')}
                  type="number"
                  ref={cohort}
                  min={0}
                  onWheel={(e) => e.currentTarget.blur()}
                />
                <input className={cx('button')} type="submit" value="Search" />
              </form>
            </div>
            <div>
              <h2>Class Search</h2>
              <form
                className={cx('search_field')}
                onSubmit={() => router.push(`/class/?courseTitleInit=${course.current.value}`)}
              >
                <input className={cx('text_field')} type="string" ref={course} />
                <input className={cx('button')} type="submit" value="Search" />
              </form>
            </div>
            <input
              className={cx('button')}
              type="button"
              onClick={() => router.push('/ChangePass')}
              value="Change Password"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
