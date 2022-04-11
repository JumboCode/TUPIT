import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import CourseSelector from '../../components/Selectors/CourseSelector';
import styles from './add.module.scss';

export default function addDegree() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [reqState, setReqState] = useState([]);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
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
            reqs: reqState.map((req) => `http://127.0.0.1:8000/api/course/${req.id}/`),
            is_tufts: t.is_tufts.checked,
            additional_info: t.additional_info.value,
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

  function addReq(req) {
    setReqState([...reqState, req]);
  }

  function removeReq(index) {
    const newReqs = [...reqState];
    newReqs.splice(index, 1);
    setReqState(newReqs);
  }

  return (
    <div className={styles.container}>
      <form className={styles.degreeForm} onSubmit={handleSubmit}>
        <div className={styles.title}>Add Degree</div>

        <div className={styles.row}>
          <p>Degree Name</p>
          <input type="text" name="degree_name" />
        </div>

        <div className={styles.row}>
          <label className={styles.checkbox}>
            Active
            <input type="checkbox" name="active" />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.checkbox}>
            Is a Tufts Degree
            <input name="is_tufts" type="checkbox" />
          </label>
        </div>

        <div className={styles.row}>
          <p>Requirements</p>
          <div className={styles.fieldList}>
            {reqState.map((course, index) => (
              <div className={styles.req} key={index}>
                <a href={`/class/${course.id}`}>{course.course_title}</a>
                <div className={styles.removeButton} onClick={() => removeReq(index)}>
                  &#10005;
                </div>
              </div>
            ))}
            <div className={styles.button} onClick={() => setShowCourseSelector(true)}>
              +
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <p>Additional Information</p>
          <textarea name="additional_info" maxLength={512} />
        </div>

        <input className={styles.button} type="submit" />
      </form>
      <CourseSelector
        show={showCourseSelector}
        writeFunction={addReq}
        onClose={() => setShowCourseSelector(false)}
      />
    </div>
  );
}
