import React, { Component } from 'react';
import styles from './class.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
// TODO: Implement Search and Requirement component.
// I think we will implement a box and click component as util to pass in text.

class Search extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section>
        <h1>Search</h1>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}> Dropdown </button>
          <div className={styles.dropdown_content}>
            <a href="#">Link 1</a>
          </div>
        </div>
      </section>
    );
  }
}

class Requirement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //TODO: Implement fetch to grab the requirements for a course
      //and display it
      requirement: ['COMP11', 'COMP15', 'COMP160'],
    };
  }

  render() {
    return (
      <section>
        <h1>Requirements</h1>
      </section>
    );
  }
}

export default class Class extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <main>
        <Search />
      </main>
    );
  }
}
