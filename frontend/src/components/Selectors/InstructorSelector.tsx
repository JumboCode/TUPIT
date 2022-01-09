import React, { useEffect, useState } from 'react';
import styles from './Selectors.module.scss';

type InstructorSelectorProps = {
  show: boolean;
  writeFunction: (instructor: string) => void;
  onClose: () => void;
};

export const InstructorSelector: React.FC<InstructorSelectorProps> = (props) => {
  const [master, setMaster] = useState(null);
  const [filteredInstructors, setFilteredInstructors] = useState(null);

  useEffect(() => {
    async function getInstructors() {
      if (!master) {
        setMaster([]);
        const url = 'http://127.0.0.1:8000/api/course';
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }).catch((err) => {
          alert('Error connecting to server');
          console.log(err);
        });
        if (res) {
          const data = await res.json();
          let instructors: Set<string> = new Set();
          data.data.forEach((course) => {
            course.attributes.instructors.forEach((instructor) => {
              instructors.add(instructor);
            });
          });
          setMaster(Array.from(instructors).sort());
        }
      }
    }

    getInstructors();
  }, []);

  useEffect(() => {
    setFilteredInstructors(master);
  }, [props.show]);

  function query(e) {
    let query = e.target.value;
    if (query == '') {
      setFilteredInstructors(master);
    } else {
      let filteredInstructors = master.filter((instructor) => {
        return instructor.toLowerCase().includes(query.toLowerCase());
      });
      setFilteredInstructors(filteredInstructors);
    }
  }

  return props.show ? (
    <div className={styles.windowContainer}>
      <div className={styles.closeArea} onClick={props.onClose}></div>
      <div className={styles.popup}>
        <div className={styles.title}>Select Instructor</div>
        <input className={styles.searchBox} placeholder="Search by name" onChange={query} />
        <div className={styles.results}>
          {filteredInstructors &&
            filteredInstructors.map((instructor, key) => (
              <div
                className={styles.result}
                key={key}
                onClick={() => {
                  props.writeFunction(instructor);
                  props.onClose();
                }}
              >
                {instructor}
              </div>
            ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default InstructorSelector;
