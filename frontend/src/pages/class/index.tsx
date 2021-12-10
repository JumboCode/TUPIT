/**
 * @author Sara
 * @author Nick
 *
 * @todo Format API endpoint. This entails finishing up renderRequest function in Class component.
 * @todo Format and refactor CSS.
 * @todo Refactor code.
 * @todo "Warning: Each child in a list should have a unique 'key' prop".
 */

import React, { useState } from 'react';
import styles from './class.module.scss';
import className from 'classnames/bind';

const cx = className.bind(styles);

interface SearchOptionInterface {
  department: string | string[] | null;
  semester: number | number[] | null;
}

interface SearchBoxInterface {
  readOption: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const search_option: SearchOptionInterface = {
  department: ['COMP', 'MATH'],
  semester: [2020, 2021, 2022, 2024],
};

// const headers: JSX.Element = (
//   <div>
//     <div className={styles.leftColumn}>
//       <h1>Search</h1>
//     </div>
//     <div className={styles.rightColumn}>
//       <h1>Requirements</h1>
//     </div>
//   </div>
// );

/**
 *
 * @callback readOption
 * @returns {JSX.element[]}
 */
const SearchBox: React.FC<SearchBoxInterface> = ({ readOption }) => {
  const search_box: JSX.Element[] = [];
  for (const key in search_option) {
    const default_option: string = key[0].toUpperCase() + key.slice(1);
    const options: JSX.Element[] = [];
    search_option[key].map((option: number | string): void => {
      options.push(
        <option key={option} value={option}>
          {option}
        </option>
      );
    });
    const box: JSX.Element = (
      <div className={styles.row}>
        <div className={styles.col_1}>
          <p>{default_option}:</p>
        </div>
        <div className={`${styles.col} ${styles.selectBox}`}>
          <select onChange={readOption} defaultValue={default_option}>
            <option key={default_option} value={default_option} disabled></option>
            {options}
          </select>
        </div>
      </div>
      // <div className={styles.selectBox}>
      //   <div className={styles.container__flex}>
      //     <p>{default_option}:</p>
      //     <select onChange={readOption} defaultValue={default_option}>
      //       <option key={default_option} value={default_option} disabled></option>
      //       {options}
      //     </select>
      //   </div>
      // </div>
    );
    search_box.push(box);
  }

  return <div>{search_box}</div>;
};

async function getCourse(url: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const data = await res.json();
  if (!data) {
    throw new Error('Unable to fetch data from Django');
  }
  return data;
}

const Class: React.FC = () => {
  const [option, setOption] = useState<SearchOptionInterface>({ department: null, semester: null });
  const [course, setCourse] = useState<JSX.Element[] | null>(null);

  const parseOption = (): void => {
    let url = 'http://127.0.0.1:8000/api/course?';
    for (let [key, value] of Object.entries(option)) {
      if (value) {
        url += `${key}=${value}&`;
      }
    }
    url = url.slice(0, url.length - 1);
    getCourse(url)
      .catch(() => {
        console.error;
        setCourse(null);
      })
      .then((data) => {
        if (data.hasOwnProperty('data')) {
          console.log(data.data);
          const tmp = data.data.map((attributes) => (
            <ul key={attributes.id}>
              <li>{attributes.attributes.course_title}</li>
            </ul>
          ));
          setCourse(tmp);
        }
      });
  };

  /**
   * Set state of option when a selection is made.
   *
   * @param {React.ChangeEventHandler<HTMLSelectElement>} - onChange event handler
   * @todo Figure out what's the type of e
   */
  const readOption = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const key = e.target[0].value.toLowerCase();
    const selection = e.target.value;
    option[key] = selection;
    setOption(option);
  };

  return (
    <main className={styles.container}>
      <div className={styles.box}>
        <h1>Search Classes</h1>
        <SearchBox readOption={readOption} />
        <div className={styles.button}>
          <button onClick={parseOption}>Search</button>
        </div>
      </div>
      {course}
    </main>
    // <main className={styles.container}>
    //   <div className={styles.box}>
    //     <div id={styles.selectBox}>
    //       <h1>Search Classes</h1>
    //       <SearchBox readOption={readOption} />
    //       <button onClick={parseOption} className={styles.button}>Search</button>
    //     </div>
    //   </div>
    //   {course}
    // </main>
    // <div className={styles.container}>
    //     <div className={styles.container__flex}>
    //         <div>
    //         <h1>Requirements</h1>
    //         </div>
    //     </div>
    // </div>
  );
};

export default Class;

// // class Requirement extends Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       requirement: {
// //         COMP15: ['COMP11', 'COMP160'],
// //         LATIN3: ['LATIN1', 'LATIN2'],
// //       },
// //     };
// //   }

// //   /**
// //    * Map course requirement as a list.
// //    */
// //   renderRequirement() {
// //     const lookup = Object.hasOwnProperty;
// //     if (!lookup.call(this.state.requirement, this.props.course)) {
// //       throw 'Course is not defined. Please check Search component dropdown.';
// //     }

// //     const requirement = this.state.requirement[this.props.course];
// //     return requirement.map((course) => <li key={course}>{course}</li>);
// //   }

// //   render() {
// //     return (
// //       <div>
// //         <ul>{this.renderRequirement()}</ul>
// //       </div>
// //     );
// //   }
// // }
