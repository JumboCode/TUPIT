import React, { useEffect, useState, createRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import styles from './index.module.scss';

const ENDPOINT = 'http://127.0.0.1:8000/api/course/';

const getData = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).catch((err) => {
    alert('Error connecting to server');
    console.log(err);
  });

  return res;
};

const SearchClass = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [departments, setDepartments] = useState([]);
  const { register, handleSubmit, setValue } = useForm();
  const { course } = router.query;
  const courseInitVal = Array.isArray(course) ? course[0] : course;

  /* Course results */
  useEffect(() => {
    setValue('courseTitle', courseInitVal ? courseInitVal : '');
    (async function() {
      const query = courseInitVal ? `${ENDPOINT}?course_title__icontains=${courseInitVal}` : ENDPOINT;
      const res = await getData(query);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  }, [courseInitVal]);

  /* Available departments */
  useEffect(() => {
    (async function() {
        fetch(ENDPOINT, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          const deps = [];
          res.data.actions.POST.department.choices.map((dep) =>
            deps.push({ name: dep.display_name, value: dep.value })
          );
          setDepartments(deps);
        });
    })();
  }, []);

  const onReset = () => {
    (async function() {
      const res = await getData(ENDPOINT);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  };

  const onSubmitSuccess = (data, e) => {
    e.preventDefault();
    (async function() {
      const query = `?course_title__icontains=${data.courseTitle}` +
                    `&course_number_tufts__icontains=${data.tuftsNumber}` + 
                    `&course_number_bhcc__icontains=${data.bhccNumber}` + 
                    `&department=${data.department}`;
      const res = await getData(`${ENDPOINT}${query}`);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Search Class</h3>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <form  onSubmit={handleSubmit(onSubmitSuccess)} onReset={onReset}
           className={styles.filterContainer}>
            <label htmlFor='courseTitle'>Course Title:</label>
            <input id='courseTitle' type='text' {...register('courseTitle')}/>
            <label htmlFor='tuftsNumber'>Tufts Course Number:</label>
            <input id='tuftsNumber' type='text' {...register('tuftsNumber')}/>
            <label htmlFor='bhccNumber'>Bunker Course Number:</label>
            <input id='bhccNumber' type='text' {...register('bhccNumber')}/>
            <label htmlFor='department'>Department:</label>
            <select name='selectDepartment' id='department' {...register('department')}>
              <option></option>
              {departments.map((dep) => (
                <option key={dep.value} value={dep.value}>
                  {dep.name}
                </option>
              ))}
            </select>
            <div></div>
            <div className={styles.button}>
              <input type='submit' value='Submit'/>
              <input type='reset' value='Reset'/>
            </div>
          </form>
        </div>
        <div className={styles.column}>
          <div className={styles.resultsWrapper}>
            {results && results.length > 0 ?
              (<div className={styles.resultsContainer}>
                <div className={styles.searchResultsHeader}>Search Result:</div>        
                <div></div>
                {results.map((course) => (
                  <React.Fragment key={course.id}>
                    <span className={styles.resultsField}>
                      {course.attributes.course_title}
                    </span>
                    <div className={styles.resultsView}>
                      <button onClick={() => router.push(`class/${course.id}`)}>
                        View
                      </button>
                    </div>
                  </React.Fragment>
                ))}
              </div>) : (
              <div className={styles.noResults}>
                No results found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchClass;