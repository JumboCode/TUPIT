import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './add.module.scss';

export default function addDegree() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const t = e.target;
    const url = 'http://127.0.0.1:8000/api/degree/';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Degree',
          attributes: {
            degree_name: t.degree_name.value,
            active: t.active.checked,
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res) {
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        if (t.active.checked)
          fetch('http://127.0.0.1:8000/set-active-degree/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({
              degree_id: data.data.id,
            }),
          }).catch((err) => {
            alert('Error connecting to server');
            console.log(err);
          });

        alert('Degree added successfully');
        router.push('/degree/[id]', `/degree/${data.data.id}`);
      } else {
        alert('Error adding degree');
      }
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.degreeForm} onSubmit={handleSubmit}>
        <div className={styles.title}>Add Degree</div>
        <div className={styles.row}>
          <p>Degree Name</p>
          <input type="text" name="degree_name" />
          <label>
            Active
            <input type="checkbox" name="active" />
          </label>
        </div>
        <input className={styles.button} type="submit" />
      </form>
    </div>
  );
}
