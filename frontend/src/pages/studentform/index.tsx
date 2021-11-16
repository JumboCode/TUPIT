import React, { useState, useEffect } from 'react'

// Import styles
import styles from './index.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles);

const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('hello world');
}

const StudentForm: React.FC = () => {
    const [student, setStudent] = useState({
        firstname: '',
        lastname: '',
        birthday: '',
        doc_num: '',
        tufts_num: '',
        bhcc_num: '',
        parole_status: '',
        student_status: '',
        cohort: 0,
        years_given: 0,
        years_left: 0,
    });

    useEffect(() => console.log(student));

    return (
        <form onSubmit={handleSubmit}>
            <label>
                First name:
                <input type="text" name="firstname" onChange={(e) => setStudent({ ...student, firstname: e.target.value })}/>
            </label><br />
            <input type="submit" value="Submit" /> 
        </form>
    );
};

export default StudentForm;