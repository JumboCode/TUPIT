import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Home({ data }) {
  function getYear(yearNum) {
    return ['freshman', 'sophomore', 'junior', 'senior'][yearNum];
  }

  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
      <h1>
        {data.data.map((data, i) => (
          <div key={i}>
            My name is {data.attributes.first_name} {data.attributes.last_name} and I am a{' '}
            {data.attributes.age} year old {getYear(data.attributes.year)}. Here are some fun facts:
            <br />
            {data.attributes.fun_facts.map((fun_fact, j) => (
              <div key={j}> - {fun_fact}</div>
            ))}
          </div>
        ))}
      </h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  context.params; // silence unused var warning

  const res = await fetch(`http://localhost:8000/api/team_leaders/`);
  const data = await res.json();

  return {
    props: { data },
  };
}
