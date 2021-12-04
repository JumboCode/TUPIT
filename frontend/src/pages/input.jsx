import React from 'react';
import Link from 'next/Link';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function Home({ data }) {
  const registerUser = async (event) => {
    event.preventDefault();

    const res = await fetch('http://localhost:8000/api/students/', {
      body: JSON.stringify({
        name: event.target.name.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    const result = await res.json();
    // result.user => 'Ada Lovelace'
  };

  return (
    <div>
      <Link href="/">
        <a>Home</a>
      </Link>
      <form onSubmit={registerUser}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name"></input>
        <br />
        <label htmlFor="age">Age:</label>
        <input type="text" id="age" name="age"></input>
        <br />
        <label htmlFor="courses">Courses:</label>
        <input type="text" id="courses" name="courses"></input>
        <br />
        <input type="submit" value="submit"></input>
      </form>
    </div>
  );
}
