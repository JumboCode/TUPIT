import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './add.module.scss';

export default function AddStudent() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    const t = e.target;
    const url = 'http://127.0.0.1:8000/api/students/';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Student',
          attributes: {
            firstname: t.firstname.value,
            lastname: t.lastname.value,
            birthday: t.birthday.value ? t.birthday.value : null,
            doc_num: t.doc_num.value,
            tufts_num: t.tufts_num.value,
            bhcc_num: t.bhcc_num.value,
            cohort: parseInt(t.cohort.value),
            parole_status: t.parole_status.value,
            student_status: t.student_status.value,
            years_given: parseInt(t.years_given.value),
            years_left: parseInt(t.years_left.value),
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res)
      if (res.ok) {
        alert('Student created successfully');
        res.json().then((data) => router.push(`/student/${data.data.id}`));
      } else {
        alert('Error creating student');
        res.json().then(console.log);
      }
  }

  return (
    <div className={styles.container}>
      <form className={styles.studentInfo} onSubmit={handleSubmit}>
        <div className={styles.title}>New Student</div>

        <div className={styles.row}>
          <p>Name</p>
          <div>
            <input name="firstname" placeholder="First Name" />
            <input name="lastname" placeholder="Last Name" />
          </div>
        </div>

        <div className={styles.row}>
          <p>Cohort</p>
          <input name="cohort" type="number" onWheel={(e) => e.currentTarget.blur()} min={0} />
        </div>

        <div className={styles.row}>
          <p>Birthday</p>
          <input name="birthday" type="date" />
        </div>

        <div className={styles.row}>
          <p>DOC Number</p>
          <input name="doc_num" type="text" pattern="W\d+" required />
        </div>

        <div className={styles.row}>
          <p>Tufts Number</p>
          <input name="tufts_num" type="text" maxLength={7} minLength={7} required />
        </div>

        <div className={styles.row}>
          <p>BHCC Number</p>
          <input name="bhcc_num" type="text" maxLength={32} />
        </div>

        <div className={styles.row}>
          <p>Parole Status</p>
          <textarea name="parole_status" maxLength={256} />
        </div>

        <div className={styles.row}>
          <p>Student Status</p>
          <textarea name="student_status" maxLength={256} />
        </div>

        <div className={styles.row}>
          <p>Years Given</p>
          <input name="years_given" type="number" min={0} onWheel={(e) => e.currentTarget.blur()} />
        </div>

        <div className={styles.row}>
          <p>Years Left</p>
          <input name="years_left" type="number" min={0} onWheel={(e) => e.currentTarget.blur()} />
        </div>

        <input className={styles.button} type="submit" value="Save" />
        <button className={styles.button} onClick={() => router.push('/student')} type="button">
          Cancel
        </button>
      </form>
    </div>
  );
}
