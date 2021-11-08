import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function JavaScript() {
  return (
    <div className={cx('demo-js')}>
      <h1>JavaScript Demo</h1>
    </div>
  );
}
