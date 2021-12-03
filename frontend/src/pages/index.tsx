import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import { CourseForm } from './CourseForm';
const cx = classNames.bind(styles);

const Home: React.FC = () => {
  return (
    <div className={cx('base')}>
      <CourseForm />
      <h1>Hello, TUPIT!</h1>
    </div>
  );
};

export default Home;
