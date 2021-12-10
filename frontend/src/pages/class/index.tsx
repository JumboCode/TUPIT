/**
 * @author Sara
 * @author Nick
 *
 * @todo Format API endpoint. This entails finishing up renderRequest function in Class component.
 * @todo Format and refactor CSS.
 * @todo Refactor code.
 */

import React, { useState, useEffect } from 'react';
import styles from './class.module.scss';
import className from 'classnames/bind';

const cx = className.bind(styles);

interface SearchOptionInterface {
  course_title: number | Set<string> | null;
  department: string | Set<string> | null;
}

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

/**
 *
 * @callback readOption
 * @returns {JSX.element[]}
 */
const SearchBox = (React.FC = ({ readQuery, option }): JSX.Element => {
  const search_box: JSX.Element[] = [];
  for (const [key, values] of Object.entries(option)) {
    const default_option: string = key[0].toUpperCase() + key.slice(1);
    const options: JSX.Element[] = [];
    values.forEach((value) => {
      options.push(
        <option key={value} value={value}>
          {value}
        </option>
      );
    });
    search_box.push(
      <div key={key} className={styles.row}>
        <div className={styles.col_1}>
          <p>{default_option}:</p>
        </div>
        <div className={`${styles.col} ${styles.selectBox}`}>
          <select onChange={readQuery} defaultValue={default_option}>
            <option key={default_option} value={default_option} disabled></option>
            {options}
          </select>
        </div>
      </div>
    );
  }
  return <div>{search_box}</div>;
});

const Class: React.FC = () => {
  const [option, setOption] = useState({ course_title: new Set(), department: new Set() });
  const [query, setQuery] = useState({
    course_title: null,
    department: null,
  });
  const [course, setCourse] = useState<JSX.Element[] | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getCourse('http://127.0.0.1:8000/api/course');

      data.data.forEach((entry) => {
        for (const [key, value] of Object.entries(entry.attributes)) {
          if (option.hasOwnProperty(key)) {
            option[key].add(value);
          }
        }
      });
      setOption({ ...option });
    })();
  }, []);

  const parseOption = (): void => {
    let url = 'http://127.0.0.1:8000/api/course?';

    /**
     * @todo Deal with when user click search but have not make a selection
     */
    for (let [key, value] of Object.entries(query)) {
      if (value) {
        url += `${key}=${value}&`;
      }
    }
    url = url.slice(0, url.length - 1);
    getCourse(url)
      .catch((e) => {
        console.log(e);
        setCourse(null);
      })
      .then((data) => {
        if (data.hasOwnProperty('data')) {
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
  const readQuery = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const key = e.target[0].value.toLowerCase();
    const selection = e.target.value;
    query[key] = selection;
    setQuery(query);
  };

  return (
    <main className={styles.container}>
      <div className={styles.box}>
        <h1>Search Classes</h1>
        <SearchBox readQuery={readQuery} option={option} />
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
