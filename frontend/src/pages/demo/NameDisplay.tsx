import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

type NameDisplayProps = {
  name: string;
};

const NameDisplay: React.FC<NameDisplayProps> = ({ name }) => (
  <div className={cx('name-display')}>
    <h1>Name: {name}</h1>
  </div>
);

export { NameDisplay, NameDisplayProps };
