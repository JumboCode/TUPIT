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
          <ControlContainer />
        </div>
        <div className={cx('admin-display')}>
          <DisplayContainer />
        </div>
      </div>
    </>
  );
};

const ControlContainer = () => {
  return (
    <div className={cx('admin-control-container')}>
      <div className={cx('admin-control-profile')}>
        <p>
          Profile
          <br />
          <br />
          <br />
          <br />
          hi
        </p>
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
  );
};

const DisplayContainer = () => {
  const DisplayListItem = (props) => {
    return (
      <div className={cx('admin-display-list-item')}>
        <li>
          Item
          <br />
          {props.num}
        </li>
      </div>
    );
  };
  return (
    <div className={cx('admin-display-container')}>
      <div className={cx('admin-display-list')}>
        <ul>
          {Array.from({ length: 20 }, (_, i) => i).map((num) => {
            return <DisplayListItem num={num} key={num} />;
          })}
        </ul>
        <div className={cx('admin-display-add-button')}>
          <p>add</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
