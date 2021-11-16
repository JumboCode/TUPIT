import React, { useState, useEffect } from 'react';

// Import styles
import styles from './index.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

const handleSubmit = (e) => {
  e.preventDefault();

  console.log('hello world');
};

const StudentForm: React.FC = () => {
  const [student, setStudent] = useState({
    firstname: '',
    lastname: '',
    birthday: '',
    doc_num: 'W',
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
        First name:{' '}
        <input
          type="text"
          name="firstname"
          value={student.firstname}
          onChange={(e) => setStudent({ ...student, firstname: e.target.value })}
        />
      </label>
      <br />
      <label>
        Last name:{' '}
        <input
          type="text"
          name="lastname"
          value={student.lastname}
          onChange={(e) => setStudent({ ...student, lastname: e.target.value })}
        />
      </label>
      <br />
      <label>
        Birthday:{' '}
        <input
          type="date"
          name="birthday"
          value={student.birthday}
          onChange={(e) => setStudent({ ...student, birthday: e.target.value })}
        />
      </label>
      <br />
      <label>
        Doc number:{' '}
        <input
          type="text"
          name="doc_num"
          value={student.doc_num}
          onChange={(e) => {
            const incoming = e.target.value == '' ? 'W' : e.target.value;
            setStudent({ ...student, doc_num: incoming });
          }}
        />
      </label>
      <br />
      <label>
        Tufts number:{' '}
        <input
          type="text"
          name="tufts_num"
          maxLength={7}
          value={student.tufts_num}
          onChange={(e) => setStudent({ ...student, tufts_num: e.target.value })}
        />
      </label>
      <br />
      <label>
        BHCC number:{' '}
        <input
          type="text"
          name="bhcc_num"
          value={student.bhcc_num}
          maxLength={32}
          onChange={(e) => setStudent({ ...student, bhcc_num: e.target.value })}
        />
      </label>
      <br />
      <label>
        Parole status:{' '}
        <input
          type="textarea"
          name="parole_status"
          value={student.parole_status}
          onChange={(e) => setStudent({ ...student, parole_status: e.target.value })}
        />
      </label>
      <br />
      <label>
        Student status:{' '}
        <input
          type="textarea"
          name="student_status"
          value={student.student_status}
          onChange={(e) => setStudent({ ...student, student_status: e.target.value })}
        />
      </label>
      <br />
      <label>
        Cohort:{' '}
        <input
          type="number"
          name="cohort"
          value={student.parole_status}
          onChange={(e) => {
            const incoming: number = e.target.value == '' ? 0 : parseInt(e.target.value);
            setStudent({ ...student, cohort: incoming });
          }}
        />
      </label>
      <br />
      <label>
        Year given:{' '}
        <input
          type="number"
          name="years_given"
          value={student.years_given}
          onChange={(e) => {
            const incoming: number = e.target.value == '' ? 0 : parseInt(e.target.value);
            setStudent({ ...student, years_given: incoming });
          }}
        />
      </label>
      <br />
      <label>
        Years left:{' '}
        <input
          type="number"
          name="years_left"
          value={student.years_left}
          onChange={(e) => {
            const incoming: number = e.target.value == '' ? 0 : parseInt(e.target.value);
            setStudent({ ...student, years_left: incoming });
          }}
        />
      </label>
      <br />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default StudentForm;
