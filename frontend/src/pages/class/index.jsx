/**
 * @author Sara
 * @author Nick
 *
 * Abstraction: Class component stores the overall state of the page. It contains multiple
 * SearchBox components. When a user selects an option, the query is passed up to Class component.
 * Class component forms the API endpoint based on user's selection and render the available courses
 * on screen.
 *
 * @todo Format API endpoint. This entails finishing up renderRequest function in Class component.
 * @todo Format and refactor CSS.
 * @todo Refactor code.
 */

import React, { Component } from 'react';
import styles from './class.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

async function getServerSideProps(context) {
  const res = await fetch(`http://localhost:8000/api/${context}/`);
  const data = await res.json();

  return {
    props: { data },
  };
}

// class Requirement extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       requirement: {
//         COMP15: ['COMP11', 'COMP160'],
//         LATIN3: ['LATIN1', 'LATIN2'],
//       },
//     };
//   }

//   /**
//    * Map course requirement as a list.
//    */
//   renderRequirement() {
//     const lookup = Object.hasOwnProperty;
//     if (!lookup.call(this.state.requirement, this.props.course)) {
//       throw 'Course is not defined. Please check Search component dropdown.';
//     }

//     const requirement = this.state.requirement[this.props.course];
//     return requirement.map((course) => <li key={course}>{course}</li>);
//   }

//   render() {
//     return (
//       <div>
//         <ul>{this.renderRequirement()}</ul>
//       </div>
//     );
//   }
// }

/**
 * Create a select box component.
 *
 * @todo Debug renderSearch(). Although search_default is disabled, it is still selectable on the UI.
 */
class SearchBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /** Default option to specify the content of the select box. */
      search_default: this.props.search_default,
      /** Options to select from. */
      search_option: this.props.search_option,
    };
  }

  /**
   * Triggers when user select an option from SearchBox component. Propagates the event upward to Class
   * component.
   *
   * @param {Object} e DOM event handler that stores <select> tag.
   */
  searchQuery = (e) => {
    this.props.searchQuery(e);
    e.preventDefault();
  };

  /**
   *
   * @returns {jsx} options Search box with options
   */
  renderSearch() {
    const disabled = this.state.search_default;
    const search_option = this.state.search_option.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
    const search_box = (
      <div className={styles.container}>
        <div className={styles.select_box}>
          <select onChange={this.searchQuery} defaultValue={disabled}>
            <option key={disabled} value={disabled} disabled>
              {disabled}
            </option>
            {search_option}
          </select>
        </div>
      </div>
    );
    return search_box;
  }

  render() {
    return this.renderSearch();
  }
}

export default class Class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_option: {
        Major: ['Computer Science', 'Cognitive Studies', 'Math', 'Psychology'],
        Semester: [2020, 2021, 2022, 2024],
      },
    };
  }

  /**
   * e.target[0] is the value of the default option and e.target.value is user's query. Update
   * the state with the default option as the key and the query as the value.
   *
   * @param {Object} e Event handler from SearchBox component when an option is selected.
   */
  searchQuery = (e) => {
    const target = e.target[0].value.toLowerCase();
    const value = e.target.value;
    const state = {};
    state[target] = value;
    this.setState(state);
  };

  /**
   * Iterate over the options and create an array of SearchBox components.
   *
   * @returns {Array} Contains SearchBox components.
   */
  renderSearchBox() {
    const search_option = this.state.search_option;
    const search_box = [];
    for (let search in search_option) {
      search_box.push(
        <SearchBox
          searchQuery={this.searchQuery}
          search_default={search}
          search_option={search_option[search]}
        />
      );
    }
    return search_box;
  }

  renderRequest(response) {
    return response;
  }

  render() {
    let requirement;
    const response = getServerSideProps('course');
    const data = this.renderRequest(response);

    // if (this.state.course) {
    //   requirement = <Requirement course={this.state.course} />;
    // }
    return (
      <main>
        {this.renderSearchBox()}
        {/* {requirement} */}
      </main>
    );
  }
}
