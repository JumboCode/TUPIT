import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import styles from './index.module.scss';

const ENDPOINT: string = 'http://127.0.0.1:8000/api/degree/?sort=is_tufts';

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

const SearchDegrees = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  /* Keep track of an unchanged record */
  const [master, setMaster] = useState([]);
  /* Filter results */
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async function () {
      const res = await getData(ENDPOINT);
      if (res && res.ok) {
        const data = await res.json();
        setMaster(data.data);
        setResults(data.data);
      }
    })();
  }, []);

  const onReset = () => {
    setResults([...master]);
  };

  const onSubmitSuccess = (data, e) => {
    e.preventDefault();
    const degreeName = data.degree.toLowerCase();
    const isTufts = data.university == 'Tufts' ? true : false;
    const filtered = master.filter((degree) => {
      return (
        degree.attributes.degree_name.toLowerCase().includes(degreeName) &&
        degree.attributes.is_tufts == isTufts
      );
    });
    setResults(filtered);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Search Degree</h3>
      </div>
      <button
        className={styles.plusButton}
        onClick={() => {
          router.push('/degree/add');
          console.log('pressed');
        }}
      >
        +
      </button>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <form
            onSubmit={handleSubmit(onSubmitSuccess)}
            onReset={onReset}
            className={styles.filterContainer}
          >
            <label htmlFor="degree">Degree Name:</label>
            <input id="degree" type="text" {...register('degree')} />
            <label htmlFor="university">University:</label>
            <select name="selectUniversity" id="university" {...register('university')}>
              <option></option>
              <option>Tufts</option>
              <option>Bunker Hill</option>
            </select>
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
                {results.map((degree) => (
                  <React.Fragment key={degree.id}>
                    <div className={styles.resultsField}>
                      <span>{degree.attributes.degree_name}</span>
                      <span>{degree.attributes.is_tufts ? 'Tufts' : 'BHCC'}</span>
                    </div>
                    <div className={styles.resultsView}>
                      <button onClick={() => router.push(`degree/${degree.id}`)}>View</button>
                    </div>
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

export default SearchDegrees;
