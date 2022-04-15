import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import CourseSelector from '../../../components/Selectors/CourseSelector';

export default function EditDegreeReqs() {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [master, setMaster] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const router = useRouter();

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
    }
  }

  useEffect(() => {
    fetchDegreeReqData();
  }, []);

  function saveSelectedReq() {
    const url = `http://127.0.0.1:8000/api/degreerequirement/' ${selectedReq.req.id}/`;
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
            title: selectedReq.req.attributes.title,
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

  function addReqCourse(course) {
    let reqData = {
      req: selectedReq.req,
      courses: [...selectedReq.courses, course],
    };
    setSelectedReq(reqData);
  }

  async function setSelectedReqData(req) {
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

  async function getCourseTitle(id) {
    let url = 'http://127.0.0.1:8000/api/course/' + id + '/';
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

  function fulfilledByEntry(course) {
    return (
      <div key={course.id}>
        <div>{course.course_title}</div>
      </div>
    );
  }

  return (
    <div>
      <div>{master.length > 0 ? master.map(reqEntry) : <div>No results found</div>}</div>
      <br />
      <br />
      <div>
        {selectedReq ? (
          <div>
            {selectedReq.req.attributes.title}
            {selectedReq.courses.map(fulfilledByEntry)}
            <div onClick={() => setShowCourseSelector(true)}>+</div>
            <div onClick={saveSelectedReq}>Save</div>
          </div>
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
