import React, { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/auth';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import AuthBox from '@/components/authbox';
const cx = classNames.bind(styles);

const Home: React.FC = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  const cohort = createRef<HTMLInputElement>();
  const course = createRef<HTMLInputElement>();

  return (
    <div className={cx('base')}>
      <AuthBox>
        <div className={cx('header')}>
          <h1>TUPIT Dashboard</h1>
        </div>
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
            <div>
              <input
                className={cx('button')}
                type="button"
                onClick={() => router.push('/resetpass')}
                value="Change Password"
              />
            </div>
          </div>
        ) : null}
      </AuthBox>
    </div>
  );
};

export default Home;
