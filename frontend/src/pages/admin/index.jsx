import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const getListData = (isClass, studentNum, classNum) => {
  const length = isClass ? classNum : studentNum;
  return Array.from({ length: length }, (_, i) => i).map((num) => {
    return {
      id: num,
      name: `${isClass ? 'Class' : 'Student'} ${num}`,
    };
  });
};

const Admin = () => {
  const [isClass, setIsClass] = React.useState(true);
  const [studentNum, setStudentNum] = React.useState(20);
  const [classNum, setClassNum] = React.useState(10);
  return (
    <>
      <style jsx global>{`
        body {
          background-color: lightblue;
        }
      `}</style>
      <div className={cx('admin-content')}>
        <div className={cx('admin-control')}>
          <ControlContainer setIsClass={setIsClass} />
        </div>
        <div className={cx('admin-display')}>
          <DisplayContainer
            isClass={isClass}
            studentNum={studentNum}
            setStudentNum={setStudentNum}
            classNum={classNum}
            setClassNum={setClassNum}
          />
        </div>
      </div>
    </>
  );
};

const ControlContainer = ({ setIsClass }) => {
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
        <div className={cx('admin-control-buttons-item')} onClick={() => setIsClass(false)}>
          <p>students</p>
        </div>
        <div className={cx('admin-control-buttons-item')} onClick={() => setIsClass(true)}>
          <p>class</p>
        </div>
      </div>
    </div>
  );
};

const DisplayContainer = ({ isClass, studentNum, setStudentNum, classNum, setClassNum }) => {
  const DisplayListItem = (props) => {
    return (
      <div className={cx('admin-display-list-item')}>
        <li>
          Item
          <br />
          {props.name}
        </li>
      </div>
    );
  };
  const AddButton = ({ isClass, addToStudentNum, addToClassNum }) => {
    return (
      <div
        className={cx('admin-display-add-button')}
        onClick={isClass ? addToClassNum : addToStudentNum}
      >
        <button>
          <p>Add {isClass ? 'class' : 'student'}</p>
        </button>
      </div>
    );
  };
  return (
    <div className={cx('admin-display-container')}>
      <div className={cx('admin-display-list')}>
        <ul>
          {getListData(isClass, studentNum, classNum).map((el) => {
            return <DisplayListItem key={el.id} name={el.name} />;
          })}
        </ul>
        <AddButton
          isClass={isClass}
          addToStudentNum={() => setStudentNum(studentNum + 1)}
          addToClassNum={() => setClassNum(classNum + 1)}
        />
      </div>
    </div>
  );
};

export default Admin;
