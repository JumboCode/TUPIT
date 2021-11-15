import React from 'react';
import { NextPage } from 'next';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Home: NextPage = () => {
  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
    </div>
  );
};

Home.getInitialProps = async () => ({
  navbar: {
    links: ['Tyler', 'Jackson', 'Michael'],
  },
});

export default Home;
