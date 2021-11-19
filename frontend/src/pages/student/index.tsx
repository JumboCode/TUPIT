import React, { useState, useRef } from 'react';
import styles from './student.module.scss';
import className from 'classnames/bind';

const cx: any = className.bind(styles);

interface StudentInterface {
  student: string;
  year: number;
  displayPopUp: (student: string) => void;
}

const getAlphabet = (): string[] => {
  // Generate an array from 0 - 25.
  const keys: number[] = Array.from(Array(26).keys(), (n) => n);
  const alphabet: string[] = [];
  // ASCII key 65 is equivalent to A.
  keys.map((n) => {
    alphabet.push(String.fromCharCode(65 + n));
  });

  return alphabet;
};

const LetterBox = (
  option: string,
  handleActiveLink: (e) => void,
  activeLinkStyle: boolean
): JSX.Element => {
  return (
    <div key={option} className={activeLinkStyle ? styles.letterItemClick : ''}>
      <button onClick={handleActiveLink}>
        <a href={`#${option}`} className={styles.letterItem}>
          <div>{option}</div>
        </a>
      </button>
    </div>
  );
};

const LetterSelection: React.FC = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);

  // React does not update the state immediately in callbacks. useRef gives access to the previous
  // value of activeLink. Because setActiveLink changes the state of the component, it is
  // re-rendered. The new state of activeLink is then set to stateRef.current
  const stateRef = useRef<number | null>(null);
  stateRef.current = activeLink;

  const handleActiveLink = (e): void => {
    // Read the current header selected and convert to integer value
    const current = e.target.innerHTML;
    const index = current.charCodeAt(0) - 65;

    // If a choice has been selected, unchange the active style for the component at the index
    if (stateRef.current) {
      const previous = String.fromCharCode(65 + stateRef.current);
      options[stateRef.current] = LetterBox(previous, handleActiveLink, false);
    }
    setActiveLink(index);
    options[index] = LetterBox(current, handleActiveLink, true);
    setOptions([...options]);
    e.preventDefault();
  };

  const letters: string[] = getAlphabet();
  const [options, setOptions] = useState<Array<JSX.Element>>(
    letters.map((option: string) => LetterBox(option, handleActiveLink, false))
  );

  return <div className={styles.letterBox}>{options}</div>;
};

const student_test = {
  A: [
    { student: 'Jackson', year: 2023 },
    { student: 'Tyler', year: 2024 },
    { student: 'Sara', year: 2025 },
    { student: 'Jason', year: 2022 },
    { student: 'Michael', year: 2023 },
    { student: 'Eddie', year: 2023 },
    { student: 'ABCD', year: 2000 },
    { student: 'BDEBASd', year: 2000 },
    { student: 'CASDASD', year: 2000 },
    { student: 'DASDasd', year: 2000 },
    { student: 'EASDASD', year: 2000 },
    { student: 'FASDASD', year: 2000 },
    { student: 'GASDASD', year: 2000 },
  ],
  B: [
    { student: 'Jackson', year: 2023 },
    { student: 'Tyler', year: 2024 },
    { student: 'Sara', year: 2025 },
    { student: 'Jason', year: 2022 },
    { student: 'Michael', year: 2023 },
    { student: 'Eddie', year: 2023 },
    { student: 'ABCD', year: 2000 },
    { student: 'BDEBASd', year: 2000 },
    { student: 'CASDASD', year: 2000 },
    { student: 'DASDasd', year: 2000 },
    { student: 'EASDASD', year: 2000 },
    { student: 'FASDASD', year: 2000 },
    { student: 'GASDASD', year: 2000 },
  ],
};

const Student: React.FC<StudentInterface> = ({ student, year, displayPopUp }) => {
  return (
    <p
      className={styles.section__studentInner}
      onClick={() => {
        displayPopUp(student);
      }}
    >
      {student}
    </p>
  );
};

const StudentDirectory: React.FC = () => {
  const [popUp, setPopUp] = useState<boolean>(false);
  const [popUpContent, setPopUpContent] = useState<JSX.Element | null>(null);
  const alphabet: string[] = getAlphabet();

  const displayPopUp = (student: string): void => {
    setPopUp(true);
    const content: JSX.Element = (
      <div className={styles.overlay}>
        <div className={styles.popup}>
          <button
            onClick={() => {
              setPopUp(false);
            }}
          >
            <a className={styles.close}>x</a>
          </button>
          <br></br>
          <br></br>
          {student}
        </div>
      </div>
    );
    setPopUpContent(content);
  };

  const section: JSX.Element[] = alphabet.map((option: string) => {
    const students: JSX.Element[] = [];
    if (student_test.hasOwnProperty(option)) {
      student_test[option].map((student: StudentInterface) => {
        students.push(
          <Student
            key={student.student}
            student={student.student}
            year={student.year}
            displayPopUp={displayPopUp}
          />
        );
      });
    }
    return (
      <div key={option} id={option} className={styles.section}>
        <div className={styles.header}>
          <h1>{option}</h1>
        </div>
        <div className={styles.section__student}>{students}</div>
      </div>
    );
  });

  return (
    <div>
      <LetterSelection />
      {section}
      {popUp && popUpContent}
    </div>
  );
};

export default StudentDirectory;
