import React, { useState, useEffect, createRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import CourseSelector from '../../../components/Selectors/CourseSelector';

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
      <div
        onClick={() => {
          setSelectedReqData(req);
        }}
        key={req.id}
      >
        <div>{req.attributes.title}</div>
      </div>
    );
  }

  function fulfilledByEntry(course) {
    return (
      <div key={course.id}>
        <div>{course.course_title}</div>
        <div onClick={() => removeReqCourse(course)}>X</div>
      </div>
    );
  }

  return (
    <div>
      <input type="text" placeholder="Search by Title" onChange={onSearch} />
      <div>{results.length > 0 ? results.map(reqEntry) : <div>No results found</div>}</div>
      <div onClick={newDegreeReq}>New</div>
      <br />
      <br />
      <div>
        {selectedReq ? (
          <form onSubmit={saveSelectedReq}>
            <div key={selectedReq.req.attributes.title}>
              <input type="text" name="title" defaultValue={selectedReq.req.attributes.title} />
            </div>
            {selectedReq.courses.map(fulfilledByEntry)}
            <div onClick={() => setShowCourseSelector(true)}>+</div>
            <div onClick={deleteSelectedReq}>Delete</div>
            <input type="submit" value="Save" />
          </form>
        ) : null}
      </div>

      <CourseSelector
        show={showCourseSelector}
        writeFunction={addReqCourse}
        onClose={() => setShowCourseSelector(false)}
      />
    </div>
  );
}
