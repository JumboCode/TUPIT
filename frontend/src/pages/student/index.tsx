import React, { useState } from 'react';
import styles from './student.module.scss';
import className from 'classnames/bind';
import { info } from 'console';

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

const LetterBox: React.FC = ({ alphabet }) => {
  const [style, setStyle] = useState(styles.letterItem);
  const changeStyle = (e) => {
    // if (chosen == "") {
    //     setStyle(styles.letterItem);
    //     LetterBox(chosen);
    // }
    e.preventDefault();
    setStyle(styles.letterItemClick);
    //setChosen({alphabet});
  };

  return (
    <div className={style}>
      <button onClick={changeStyle}>
        <a href={`#${alphabet}`}>{alphabet}</a>
      </button>
    </div>
  );
};

const LetterSelection: React.FC = () => {
  const letters: string[] = getAlphabet();
  const options: JSX.Element[] = [];
  letters.map((option: string) => {
    options.push(<LetterBox alphabet={option} />);
  });

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
          <a className={styles.close}>x</a>
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
