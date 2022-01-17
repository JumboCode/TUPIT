/**
 * @author Sara
 * @author Nick
 *
 * @todo Format and refactor CSS.
 * @todo Refactor code.
 */

import React, { useState, useEffect }  from 'react';

import { SearchOptionInterface, SearchBoxInterface } from './interface';
import styles from './class.module.scss';
import className from 'classnames/bind';

const cx = className.bind(styles);

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
 * @returns {JSX.element}
 */
const SearchBox = (props: SearchBoxInterface): JSX.Element =>  {
  return (
    <div className={styles.row}>
      <div className={styles.col_1}>
        <p>{props.boxName}</p>
      </div>
      <div className={`${styles.col} ${styles.selectBox}`}>
        <select id={props.boxKey} onChange={props.handleQuery}>
          <option value={''}></option>
          {Array
            .from(props.boxValue)
            .map((entry) => (<option key={entry} value={entry}>{entry}</option>))
          }
        </select>
      </div>
    </div>
  )
};

const Class = () => {
  const [option, setOption] = useState<SearchOptionInterface>({
    course_title: new Set(),
    department: new Set() 
  });
  const [query, setQuery] = useState<SearchOptionInterface>({
    course_title: '',
    department: '',
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
  const handleQuery = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    query[e.target.id] = e.target.value;
    setQuery(query);
  };

  return (
    <main className={styles.container}>
      <div className={styles.box}>
        <h1>Search Classes</h1>
        <SearchBox 
          boxName={'Course'}
          boxKey={'course_title'}
          boxValue={option.course_title as Set<string>}
          handleQuery={handleQuery}
        />
        <SearchBox
          boxName={'Department'}
          boxKey={'department'}
          boxValue={option.department as Set<string>}
          handleQuery={handleQuery}
        />
        <div className={styles.button}>
          <button onClick={parseOption}>Search</button>
        </div>
      </div>
      {course}
    </main>
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
