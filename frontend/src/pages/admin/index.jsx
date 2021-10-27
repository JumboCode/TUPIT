import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const Admin = () => {
  return (
    <>
      <div className={cx('admin-content')}>
        <div className={cx('admin-control')}>
          <div className={cx('admin-control-profile')}>
            <p>Profile</p>
          </div>
          <div className={cx('admin-control-buttons')}>
            <div className={cx('admin-control-buttons-item')}>
              <p>students</p>
            </div>
            <div className={cx('admin-control-buttons-item')}>
              <p>class</p>
            </div>
          </div>
        </div>
        <div className={cx('admin-display')}>
          <p>display</p>
          <div className={cx('admin-display-list')}></div>
          <div className={cx('admin-display-add-button')}>
            <p>add</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
