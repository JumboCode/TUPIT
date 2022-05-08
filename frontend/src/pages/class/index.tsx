import React, { useEffect, useState, createRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './index.module.scss';

const ENDPOINT = 'http://127.0.0.1:8000/api/course/';

const getData = async (url) => {
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

  return res;
};

const SearchClass = () => {
  const { csrfToken } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const { register, handleSubmit, setValue } = useForm();
  const { course } = router.query;
  const courseInitVal = Array.isArray(course) ? course[0] : course;

  /* Course results */
  useEffect(() => {
    setValue('courseTitle', courseInitVal ? courseInitVal : '');
    (async function () {
      const query = courseInitVal
        ? `${ENDPOINT}?course_title__icontains=${courseInitVal}`
        : ENDPOINT;
      const res = await getData(query);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  }, [courseInitVal]);

  const onReset = () => {
    (async function () {
      const res = await getData(ENDPOINT);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  };

  const onSubmitSuccess = (data, e) => {
    e.preventDefault();
    (async function () {
      const query =
        `?course_title__icontains=${data.courseTitle}` +
        `&course_number_tufts__icontains=${data.tuftsNumber}` +
        `&course_number_bhcc__icontains=${data.bhccNumber}` +
        `&department__icontains=${data.department}`;
      const res = await getData(`${ENDPOINT}${query}`);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  };

  async function addCourse() {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Course',
          attributes: {
            course_title: 'New Course',
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res && res.ok) {
      const data = await res.json();
      router.push(`/class/${data.data.id}`);
    }
  }

  return (
    <div className={styles.container}>
      <button className={styles.plusButton} onClick={addCourse}>
        +
      </button>
      <div className={styles.header}>
        <h3>Search Class</h3>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <form
            onSubmit={handleSubmit(onSubmitSuccess)}
            onReset={onReset}
            className={styles.filterContainer}
          >
            <label htmlFor="courseTitle">Course Title:</label>
            <input id="courseTitle" type="text" {...register('courseTitle')} />
            <label htmlFor="tuftsNumber">Tufts Course Number:</label>
            <input id="tuftsNumber" type="text" {...register('tuftsNumber')} />
            <label htmlFor="bhccNumber">Bunker Course Number:</label>
            <input id="bhccNumber" type="text" {...register('bhccNumber')} />
            <label htmlFor="department">Department:</label>
            <input id="department" type="text" {...register('department')} />
            <div></div>
            <div className={styles.buttonBox}>
              <input className={styles.button} type="submit" value="Submit" />
              <input className={styles.button} type="reset" value="Reset" />
            </div>
          </form>
        </div>
        <div className={styles.column}>
          <div className={styles.resultsWrapper}>
            {results && results.length > 0 ? (
              <div className={styles.resultsContainer}>
                <span className={styles.searchResultsHeader}>Search Results:</span>
                <div></div>
                {results.map((course) => (
                  <React.Fragment key={course.id}>
                    <button
                      className={styles.resultsField}
                      onClick={() => router.push(`class/${course.id}`)}
                    >
                      <span>{course.attributes.course_title}</span>
                      <span>View</span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className={styles.noResults}>No results found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchClass;
