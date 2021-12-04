import React from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

//export default function Home() {
//const [data, setData] = React.useState(false);
//React.useEffect(() => {
//getData();
//});
//function getData() {
//fetch('http://localhost:8000')
//.then((res) => res.text())
//.then(setData);
//}

export default function Home({ data }) {
  return (
    <div className={cx('base')}>
      <h1>Hello, TUPIT!</h1>
      <h1>
        <ul>
          {data.data.map((data, i) => (
            <li key={i}>
              [{data.id}] My name is {data.attributes.name} {data.attributes.last_name} and I am an{' '}
              {data.attributes.age} year old taking {data.attributes.courses}.
            </li>
          ))}
        </ul>
      </h1>
    </div>
  );
}

export async function getServerSideProps(context) {
  context.params; // silence unused var warning

  const res = await fetch('http://localhost:8000/api/students');
  console.log(res);
  const data = await res.json();

  return {
    props: { data },
  };
}
