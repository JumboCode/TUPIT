import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Home() {
  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
    </div>
  );
}
