import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import { NameDisplay } from './NameDisplay';

const Page: React.FC = () => (
  <div className={cx('demo-ts')}>
    <NameDisplay name={'Jackson'} />
    <NameDisplay name={123} />
  </div>
);

export default Page;
