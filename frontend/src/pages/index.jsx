import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
import NameForm from './nameform';
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
            [{data.id}] My name is {data.attributes.first_name} {data.attributes.last_name} and I am
            a {data.attributes.age} year old {getYear(data.attributes.year)}.
            <NameForm leader={data} />
            Here are some fun facts:
            <br />
            {data.attributes.fun_facts.map((fun_fact, j) => (
              <div key={j}> - {fun_fact}</div>
            ))}
            <br />
          </div>
        ))}
      </h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  context.params; // silence unused var warning

  const res = await fetch('http://localhost:8000/api/team_leaders/?sort=first_name');
  const data = await res.json();

  return {
    props: { data },
  };
}
