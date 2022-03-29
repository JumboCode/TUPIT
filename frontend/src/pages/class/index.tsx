import React, { useEffect, useState, createRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './index.module.scss';

export default function SearchClass() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [depOpts, setDepOpts] = useState([]);

  const courseTitle = createRef<HTMLInputElement>();
  const tuftsCourseNum = createRef<HTMLInputElement>();
  const bunkerCourseNum = createRef<HTMLInputElement>();
  const department = createRef<HTMLSelectElement>();

  useEffect(() => {
    async function getClasses() {
      const res = await fetch('http://127.0.0.1:8000/api/course/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    }

    async function getDepartmentData() {
      fetch('http://127.0.0.1:8000/api/course/', {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          let deps = [];
          res.data.actions.POST.department.choices.map((dep) =>
            deps.push({ name: dep.display_name, value: dep.value })
          );
          setDepOpts(deps);
        });
    }

    getClasses();
    getDepartmentData();
  }, []);

  async function onSearch(e) {
    e.preventDefault();

    const query = `?course_title__icontains=${courseTitle.current.value}&course_number_tufts__icontains=${tuftsCourseNum.current.value}&course_number_bhcc__icontains=${bunkerCourseNum.current.value}&department=${department.current.value}`;

    const res = await fetch(`http://127.0.0.1:8000/api/course/${query}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });
    if (res && res.ok) {
      const data = await res.json();
      setResults(data.data);
    }
  }

  function classResult(course) {
    return (
      <div className={styles.result} onClick={() => router.push(`class/${course.id}`)}>
        <div className={styles.courseTitle}>{`${course.attributes.course_title}`}</div>
        <div className={styles.courseInfo}>
          <span>Tufts: {`${course.attributes.course_number_tufts}`}</span>
          <span>BHCC: {`${course.attributes.course_number_bhcc}`}</span>
          <span>Department: {`${course.attributes.department}`}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.windowContainer}>
      <div className={styles.window}>
        <form onSubmit={onSearch} className={styles.filterContainer}>
          <div className={styles.filterFields}>
            <div className={styles.label}>Course Title</div>
            <input type="text" ref={courseTitle} />
            <div className={styles.label}>Tufts Course Number</div>
            <input type="text" ref={tuftsCourseNum} />
            <div className={styles.label}>Bunker Course Number</div>
            <input type="text" ref={bunkerCourseNum} />
            <div className={styles.label}>Department</div>
            <select name="department" className={styles.select} ref={department}>
              <option></option>
              {depOpts.map((dep) => (
                <option key={dep.value} value={dep.value}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>
          <input className={styles.button} type="submit" value="Search" />
        </form>
        <div className={styles.resultsContainer}>
          <div className={styles.results}>
            {results &&
              (results.length > 0 ? (
                results.map(classResult)
              ) : (
                <div className={styles.noResults}>No results found</div>
              ))}
          </div>
          <div className={styles.button} onClick={() => router.push('/class/add')}>
            +
          </div>
        </div>
      </div>
    </div>
  );
}
