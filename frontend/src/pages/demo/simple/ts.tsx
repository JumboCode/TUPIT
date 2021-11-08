import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const TypeScript: React.FC = () => (
  <div className={cx('demo-ts')}>
    <h1>TypeScript Demo</h1>
  </div>
);

export default TypeScript;
