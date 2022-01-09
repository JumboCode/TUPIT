import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import CourseSelector from '../../components/Selectors/CourseSelector';
import styles from './[id].module.scss';

async function fetchCourseName(id) {
  let url = 'http://127.0.0.1:8000/api/course/' + id + '/';
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
    const course_name = await res.json().then((data) => data.data.attributes.course_title);
    return course_name;
  }
  return null;
}

export default function ViewDegree() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [degreeData, setDegreeData] = useState(null);
  const [reqState, setReqState] = useState([]);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function fetchDegreeData() {
      const url = `http://127.0.0.1:8000/api/degree/${id}/`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
        credentials: 'include',
      }).catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });

      if (res) {
        const data = await res.json();
        setDegreeData(data.data);
        let reqs = [];
        for (let req of data.data.relationships.reqs.data) {
          reqs.push({
            id: req.id,
            course_title: await fetchCourseName(req.id),
          });
        }
        setReqState(reqs);
      }
    }

    if (id) fetchDegreeData();
  }, [id]);

  function addReq(req) {
    setReqState([...reqState, req]);
  }

  function removeReq(index) {
    const newReqs = [...reqState];
    newReqs.splice(index, 1);
    setReqState(newReqs);
  }

  async function putDegreeInfo(e) {
    e.preventDefault();
    const t = e.target;
    const url = `http://127.0.0.1:8000/api/degree/${id}/`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Degree',
          id: id,
          attributes: {
            degree_name: t.degree_name.value,
            active: t.active.checked,
            reqs: reqState.map((req) => `http://127.0.0.1:8000/api/course/${req.id}/`),
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });
    if (res)
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
              degree_id: id,
            }),
          }).catch((err) => {
            alert('Error connecting to server');
            console.log(err);
          });

        alert('Degree Updated');
        router.push('/degree');
      } else {
        alert('Error updating degree');
        console.log(await res.json());
      }
  }

  async function deleteDegree() {
    if (confirm('Are you sure you want to delete this degree?')) {
      const url = `http://127.0.0.1:8000/api/degree/${id}/`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      }).catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });
      if (res)
        if (res.ok) {
          alert('Degree Deleted');
          router.push('/degree');
        } else {
          alert('Error deleting degree');
          console.log(await res.json());
        }
    }
  }

  return (
    <div className={styles.container}>
      {degreeData ? (
        <form className={styles.degreeInfo} onSubmit={putDegreeInfo}>
          <input
            name="degree_name"
            className={styles.degreeName}
            defaultValue={degreeData.attributes.degree_name}
            size={25}
            maxLength={32}
            required
          />

          <div className={styles.row}>
            <label>
              Active
              <input name="active" type="checkbox" defaultChecked={degreeData.attributes.active} />
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

          <input className={styles.button} type="submit" value="Save" />
          <button className={styles.button} type="button" onClick={() => router.push('/degree')}>
            Cancel
          </button>
          <button className={styles.button} type="button" onClick={deleteDegree}>
            Delete
          </button>
        </form>
      ) : (
        <h1>Loading...</h1>
      )}
      <CourseSelector
        show={showCourseSelector}
        writeFunction={addReq}
        onClose={() => setShowCourseSelector(false)}
      />
    </div>
  );
}
