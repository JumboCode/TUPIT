import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Home({ data }) {
  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
      <h1>
        My name is {data.data[0].attributes.name} and I am {data.data[0].attributes.age} years old
      </h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  context.params; // silence unused var warning

  const res = await fetch(`http://localhost:8000/api/students/`);
  const data = await res.json();

  return {
    props: { data },
  };
}
