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
  major: string | string[] | null;
  semester: number | number[] | null;
}

interface SearchBoxInterface {
  readOption: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const search_option: SearchOptionInterface = {
  major: ['Computer Science', 'Cognitive Studies', 'Math', 'Psychology'],
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

const button: JSX.Element = (
  <div className={styles.button}>
    <h1>Search</h1>
  </div>
);

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
      <div className={styles.selectBox}>
        <div className={styles.container__flex}>
          <p>{default_option}:</p>
          <select onChange={readOption} defaultValue={default_option}>
            <option key={default_option} value={default_option} disabled></option>
            {options}
          </select>
        </div>
      </div>
    );
    search_box.push(box);
  }

  return <div>{search_box}</div>;
};

const Class: React.FC = () => {
  const [option, setOption] = useState<SearchOptionInterface>({ major: null, semester: null });

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
        <div id={styles.selectBox}>
          <h1>Search Classes</h1>
          <SearchBox readOption={readOption} />
        </div>
      </div>
    </main>
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
