import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import styles from './index.module.scss';

export default function SearchDegrees() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [master, setMaster] = useState([]);
  const [results, setResults] = useState([]);
  const router = useRouter();

  const searchInput = useRef(null);

  useEffect(() => {
    async function fetchDegreeData() {
      const url = 'http://127.0.0.1:8000/api/degree/?sort=is_tufts';
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
        setMaster(data.data);
        setResults(data.data);
      }
    }

    fetchDegreeData();
  }, []);

  async function onSearch(e) {
    e.preventDefault();
    const searchTerm = searchInput.current.value;
    const filteredResults = master.filter((degree) =>
      degree.attributes.degree_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setResults(filteredResults);
  }

  function degreeResult(degree) {
    return (
      <div
        className={styles.result}
        onClick={() => router.push(`degree/${degree.id}`)}
        key={degree.id}
      >
        <div className={styles.degreeName}>
          {degree.attributes.degree_name} {degree.attributes.active ? '(SELECTED)' : null}
        </div>
        <div className={styles.degreeInfo}>
          <span>{degree.attributes.is_tufts ? 'Tufts' : 'BHCC'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.windowContainer}>
      <div className={styles.window}>
        <form onSubmit={onSearch} className={styles.filterContainer}>
          <div className={styles.filterFields}>
            <div className={styles.label}>Degree Name</div>
            <input type="text" ref={searchInput} />
          </div>
          <input className={styles.button} type="submit" value="Search" />
        </form>
        <div className={styles.results}>
          {results.length > 0 ? (
            results.map(degreeResult)
          ) : (
            <div className={styles.noResults}>No results found</div>
          )}
          <div className={styles.button} onClick={() => router.push('/degree/add')}>
            +
          </div>
        </div>
      </div>
    </div>
  );
}
