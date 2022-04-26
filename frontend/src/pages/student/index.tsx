import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './index.module.scss';

const ENDPOINT: string = `http://127.0.0.1:8000/api/students/?ordering=lastname`;

/*
 * Get data on query.
 */
const getData = async (url: string) => {
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

const SearchStudents = () => {
  const router = useRouter();
  const [results, setResults] = useState([]); /* Query results */
  const { register, handleSubmit, setValue } = useForm();
  const { cohortInit } = router.query;
  const cohortInitVal = Array.isArray(cohortInit) ? cohortInit[0] : cohortInit;

  useEffect(() => {
    console.log(cohortInitVal);
    setValue('cohort', cohortInitVal ? cohortInitVal : '');
    (async function () {
      const query = cohortInitVal ? `${ENDPOINT}&cohort=${cohortInitVal}` : ENDPOINT;
      const res = await getData(query);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  }, [cohortInitVal]);

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
        `&firstname__icontains=${data.firstName}` +
        `&lastname__icontains=${data.lastName}` +
        `&tufts_num=${data.tuftsNum}` +
        `&bhcc_num=${data.bhccNum}` +
        `&cohort=${data.cohort}` +
        `&doc_num=${data.docNum}`;
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
        <h3>Search Student</h3>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <form
            onSubmit={handleSubmit(onSubmitSuccess)}
            onReset={onReset}
            className={styles.filterContainer}
          >
            <label htmlFor="firstName">First Name:</label>
            <input id="firstName" type="text" {...register('firstName')} />
            <label htmlFor="lastName">Last Name:</label>
            <input id="lastName" type="text" {...register('lastName')} />
            <label htmlFor="tuftsNum">Tufts Number:</label>
            <input id="tuftsNum" type="text" {...register('tuftsNum')} />
            <label htmlFor="bhccNum">BHCC Number:</label>
            <input id="bhccNum" type="text" {...register('bhccNum')} />
            <label htmlFor="docNum">DOC Number:</label>
            <input id="docNum" type="text" {...register('docNum')} />
            <label htmlFor="cohort">Cohort:</label>
            <input id="cohort" type="text" {...register('cohort')} />
            <div></div>
            <div className={styles.button}>
              <input type="submit" value="Submit" />
              <input type="reset" value="Reset" />
            </div>
          </form>
        </div>
        <div className={styles.column}>
          <div className={styles.resultsWrapper}>
            {results && results.length > 0 ? (
              <div className={styles.resultsContainer}>
                <div className={styles.searchResultsHeader}>Search Result:</div>
                <div></div>
                {results.map((student) => {
                  const key = `${student.attributes.firstname} ${student.attributes.lastname}`;
                  return (
                    <React.Fragment key={key}>
                      <button
                        className={styles.resultsField}
                        onClick={() => router.push(`student/${student.id}`)}
                      >
                        <span>{key}</span>
                        <span>View</span>
                      </button>
                    </React.Fragment>
                  );
                })}
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

export default SearchStudents;
