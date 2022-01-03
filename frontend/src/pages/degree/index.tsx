import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';

export default function SearchDegrees() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [degreeData, setDegreeData] = useState([]);

  useEffect(() => {
    async function fetchDegreeData() {
      const url = 'http://127.0.0.1:8000/api/degree/';
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
        setDegreeData(data);
        console.log(data);
      }
    }

    fetchDegreeData();
  }, []);

  return (
    <div>
      <h1>Search Degrees</h1>
    </div>
  );
}
