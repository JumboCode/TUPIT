import React, { Component } from 'react';
import styles from './class.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Requirement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requirement: {
                'COMP15': ['COMP11', 'COMP160'],
                'LATIN3': ['LATIN1', 'LATIN2']
            }
        };
    }

    /**
     * Map course requirement as a list.
     */
	renderRequirement() {
		const lookup = Object.hasOwnProperty;
		if (!lookup.call(this.state.requirement, this.props.course)) {
            throw 'Course is not defined. Please check Search component dropdown.';
		}
    
        const requirement = this.state.requirement[this.props.course]
        return requirement.map(
            (course) => (
                <li key={course}>{ course }</li>
            ) 
        );
    }

	render() {
		return (
		    <div>
			    <ul>{this.renderRequirement()}</ul>
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
    };

    render() {
        return (
            <section>
                <h1>Search:</h1>
                <div className={styles.container}>
                    <div className={styles.select_box}>
                        <select onChange={this.searchCourse}>
                            <option defaultValue="Classes" selected disabled>Classes</option>
                            <option value="COMP15">Data Structure</option>
                            <option value="LATIN3">Latin 3</option>
                        </select>
                    </div>
                </div>
            </section>
        );
    }
}

/* 
Class creates multiple Search components - semester, class, major, keywords 
* Search componenets allow users to specify the option
* Searched option is passed to Class component
* Class component stored the state of the search -> query 
* On submit, print the course requirements? 
*/
export default class Class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null,
        };
    }

    /**
     * @param {string} course Course is passed up from Search component.
    */
    searchCourse = (course) => {
        this.setState({ course: course });
    };

    render() {
        let requirement;
        if (this.state.course) {
            requirement = <Requirement course={this.state.course} />;
        }

        return (
            <main>
                <Search searchCourse={this.searchCourse} />
                {requirement}
            </main>
        );
    }
}
