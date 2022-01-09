import React, { useEffect, useState } from 'react';
import styles from './Selectors.module.scss';

type CourseSelectorProps = {
  show: boolean;
  writeFunction: (course: { course_title: string; id: number }) => void;
  onClose: () => void;
};

export const CourseSelector: React.FC<CourseSelectorProps> = (props) => {
  const [master, setMaster] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState(null);

  useEffect(() => {
    async function getCourses() {
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
        let courses = data.data.map((i) => {
          return {
            course_title: i.attributes.course_title,
            id: i.id,
          };
        });
        setMaster(Array.from(courses).sort());
      }
    }

    getCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(master);
  }, [props.show]);

  function query(e) {
    let query = e.target.value;
    if (query == '') {
      setFilteredCourses(master);
    } else {
      let filteredCourses = master.filter((course) =>
        course.course_title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCourses(filteredCourses);
    }
  }

  return props.show ? (
    <div className={styles.windowContainer}>
      <div className={styles.closeArea} onClick={props.onClose}></div>
      <div className={styles.popup}>
        <div className={styles.title}>Select Course</div>
        <input className={styles.searchBox} placeholder="Search by name" onChange={query} />
        <div className={styles.results}>
          {filteredCourses &&
            filteredCourses.map((course) => (
              <div
                className={styles.result}
                key={course.id}
                onClick={() => {
                  props.writeFunction(course);
                  props.onClose();
                }}
              >
                {course.course_title}
              </div>
            ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default CourseSelector;
