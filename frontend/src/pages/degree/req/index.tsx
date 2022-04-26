import React, { useState, useEffect, createRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import CourseSelector from '../../../components/Selectors/CourseSelector';
import styles from './index.module.scss';

export default function EditDegreeReqs() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [master, setMaster] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [selectedReqTitle, setSelectedReqTitle] = useState('');

  async function fetchDegreeReqData() {
    const url = 'http://127.0.0.1:8000/api/degreerequirement/';
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
      setMaster(data.data);
      setResults(data.data);
    }
  }

  useEffect(() => {
    fetchDegreeReqData();
  }, []);

  function onSearch(e) {
    const search = e.target.value;
    const results = master.filter((req) => {
      return req.attributes.title.toLowerCase().includes(search.toLowerCase());
    });
    setResults(results);
  }

  function saveSelectedReq(e) {
    e.preventDefault();

    const url = `http://127.0.0.1:8000/api/degreerequirement/${selectedReq.req.id}/`;
    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'DegreeRequirement',
          id: selectedReq.req.id,
          attributes: {
            title: e.target.title.value,
            fulfilled_by: selectedReq.courses.map(
              (course) => `http://127.0.0.1:8000/api/course/${course.id}/`
            ),
          },
        },
      }),
    })
      .then((res) => {
        if (res.ok) {
          alert('Successfully updated degree requirement');
        } else {
          alert('Error updating degree requirement');
        }
        fetchDegreeReqData();
      })
      .catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });

    selectedReq.req.attributes.title = e.target.title.value;

    setSelectedReq(selectedReq);
  }

  function deleteSelectedReq() {
    const url = `http://127.0.0.1:8000/api/degreerequirement/${selectedReq.req.id}/`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          alert('Successfully deleted degree requirement');
        } else {
          alert('Error deleting degree requirement');
        }
        fetchDegreeReqData();
        setSelectedReq(null);
      })
      .catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });
  }

  function newDegreeReq() {
    const url = 'http://127.0.0.1:8000/api/degreerequirement/';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'DegreeRequirement',
          attributes: {
            title: 'New Degree Requirement',
            fulfilled_by: [],
          },
        },
      }),
    })
      .then((res) => {
        if (!res.ok) alert('Error creating degree requirement');
        fetchDegreeReqData();
      })
      .catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });
  }

  function addReqCourse(course) {
    let reqData = {
      req: selectedReq.req,
      courses: [...selectedReq.courses, course],
    };
    setSelectedReq(reqData);
  }

  function removeReqCourse(course) {
    let reqData = {
      req: selectedReq.req,
      courses: selectedReq.courses.filter((c) => c.id !== course.id),
    };
    setSelectedReq(reqData);
  }

  async function setSelectedReqData(req) {
    setSelectedReq(null);
    let reqData = {
      req: null,
      courses: [],
    };
    reqData.req = req;
    let courses = req.relationships.fulfilled_by.data;
    for (let course of courses) {
      let course_title = await getCourseTitle(course.id);
      reqData.courses.push({
        id: course.id,
        course_title: course_title,
      });
    }
    setSelectedReq(reqData);
  }

  async function getCourseTitle(id) {
    let url = `http://127.0.0.1:8000/api/course/${id}/`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).catch(console.log);
    if (res) {
      const data = await res.json();
      return data.data.attributes.course_title;
    }
    return null;
  }

  function reqEntry(req) {
    return (
      <div>
        <div
          className={styles.reqEntry}
          onClick={() => {
            setSelectedReqData(req);
          }}
          key={req.id}
        >
          {req.attributes.title}
        </div>
      </div>
    );
  }

  function fulfilledByEntry(course) {
    return (
      <div className={styles.row} key={course.id}>
        <div></div>
        <div className={styles.classReq}>
          <div className={styles.button} onClick={() => removeReqCourse(course)}>
            X
          </div>
          {course.course_title}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1 className={styles.header}>Degree Requirements</h1>
        <div className={styles.row}>
          <input
            type="text"
            name="Requriement search"
            placeholder="Search by Title"
            onChange={onSearch}
          />
          <button className={styles.button} onClick={newDegreeReq}>
            New Requirement
          </button>
        </div>

        <div>
          <div className={styles.header}>
            <h2>Requirement Sets</h2>
          </div>
          <div className={styles.twoColumn}>
            {results.length > 0 ? results.map(reqEntry) : <div>No results found</div>}
          </div>
        </div>
        <div>
          {selectedReq ? (
            <div>
              <div className={styles.header}>
                <h2>Modify requirements for {selectedReq.req.attributes.title}</h2>
              </div>
              <form className={styles.modify} onSubmit={saveSelectedReq}>
                <div className={styles.row} key={selectedReq.req.attributes.title}>
                  <input type="text" name="title" defaultValue={selectedReq.req.attributes.title} />
                  <div
                    className={styles.button}
                    tabIndex={0}
                    onClick={() => setShowCourseSelector(true)}
                  >
                    Add Course
                  </div>
                </div>
                <div className={styles.row}>
                  <div></div>
                  <div className={styles.header}>
                    <h3>Required Courses</h3>
                  </div>
                </div>

                <div className={styles.modify}>{selectedReq.courses.map(fulfilledByEntry)}</div>

                <div className={styles.row}>
                  <div className={styles.button} onClick={deleteSelectedReq}>
                    Delete
                  </div>
                  <input className={styles.button} name="Save" type="submit" value="Save" />
                </div>
              </form>
            </div>
          ) : null}
        </div>
      </div>

      <CourseSelector
        show={showCourseSelector}
        writeFunction={addReqCourse}
        onClose={() => setShowCourseSelector(false)}
      />
    </div>
  );
}
