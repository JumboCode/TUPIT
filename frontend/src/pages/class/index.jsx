import React, { Component } from 'react';
import styles from './class.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

// Semester: [2021, 2022]
// Class: [Comp15, Latin 2]
// Output: Comp11 -> Comp15
// Latin 1 -> Latin 2

class Requirement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requirement: {
                "COMP15": ["COMP11", "COMP160"],
                "LATIN3": ["LATIN1", "LATIN2"]
            }
        };
    }

    /**
     * Map course requirement as a list.
     */
    renderRequirement() {
        if (!this.state.requirement.hasOwnProperty(this.props.course)) {
            throw "Course is not defined. Please check Search component dropdown.";
        }
        const requirement = this.state.requirement[this.props.course].map(
            (course) => (
                <li key={course}>{ course }</li>
            ) 
        );
        return requirement;
    }

    render() {
        return (
            <div>
                <ul>
                    { this.renderRequirement() }
                </ul>
            </div>
        );
    }
} 

class Search extends Component {
	constructor(props) {
		super(props);
	}
  
    /** 
     * The value of the selected course is passed to Class to render the
     * requirements.
     *
     * @param {object} event Event handler when a course is selected.
     */
    searchCourse = (event) => {
        this.props.searchCourse(event.target.value);
        event.preventDefault();
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

export default class Class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null
        };
    }


    /** 
     * @param {string} course Course is passed up from Search component.
     */
    searchCourse = (course) => {
        this.setState({course: course})
    }
    
    render() {
        let requirement;
        if (this.state.course) {
            requirement = < Requirement course={this.state.course} />;
        } 

        return (
            <main>
                < Search searchCourse={this.searchCourse} />
                { requirement }
            </main>
        );
    }
}
