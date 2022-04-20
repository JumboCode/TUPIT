import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import { InstructorSelector } from '../../components/Selectors/InstructorSelector';
import { CourseSelector } from '../../components/Selectors/CourseSelector';
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

export default function ViewClass() {
  const [courseData, setCourseData] = useState(null);
  const [showInstructorSelector, setShowInstructorSelector] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [instructorsState, setInstructors] = useState([]);
  const [prereqsState, setPrereqs] = useState([]);
  const [depOpts, setDepOpts] = useState([]);
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    async function getCourseData() {
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

      if (res)
        if (res.ok)
          res.json().then(async (data) => {
            setCourseData(data.data);
            setInstructors(data.data.attributes.instructors);

            let prereqs = [];
            let ids = data.data.relationships.prereqs.data.map((i) => i.id);
            for (const id of ids) prereqs.push({ title: await fetchCourseName(id), id: id });
            setPrereqs(prereqs);
          });
        else {
          alert('Class not found');
          router.push('/');
        }
    }

    async function getDepartmentData() {
      fetch('http://127.0.0.1:8000/api/course/', {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((res) => {
          let deps = [];
          res.data.actions.POST.department.choices.map((dep) =>
            deps.push({ name: dep.display_name, value: dep.value })
          );
          setDepOpts(deps);
        });
    }

    if (id) {
      getCourseData();
      getDepartmentData();
    }
  }, [id]);

  function addInstructor(name) {
    let newInstructors = [...instructorsState, name];
    setInstructors(newInstructors);
  }

  function updateInstructor(event, index) {
    let newInstructors = [...instructorsState];
    newInstructors[index] = event.target.value;
    setInstructors(newInstructors);
  }

  function removeInstructor(index: number) {
    let newInstructors = [...instructorsState];
    newInstructors.splice(index, 1);
    setInstructors(newInstructors);
  }

  function addPrereq(course) {
    setPrereqs([...prereqsState, { title: course.course_title, id: course.id }]);
  }

  function removePrereq(index: number) {
    let newPrereqs = [...prereqsState];
    newPrereqs.splice(index, 1);
    setPrereqs(newPrereqs);
  }

  async function putClassInfo(e) {
    e.preventDefault();

    const url = `http://127.0.0.1:8000/api/course/${id}/`;
    const t = e.target;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Course',
          id: id,
          attributes: {
            course_title: t.course_title.value,
            course_number_tufts: t.course_number_tufts.value,
            course_number_bhcc: t.course_number_bhcc.value,
            credits_tufts: t.credits_tufts.value,
            credits_bhcc: t.credits_bhcc.value,
            department: t.department.value,
            instructors: instructorsState,
            prereqs: prereqsState.map((prereq) => `http://127.0.0.1:8000/api/course/${prereq.id}/`),
            additional_info: t.additional_info.value,
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res)
      if (res.ok) {
        alert('Successfully updated course info');
        router.push('/class');
        // router.push(id.toString());
      } else {
        alert('Error updating class info');
        console.log(res);
      }
  }

  return (
    <div className={styles.container}>
      {courseData ? (
        <form onSubmit={putClassInfo}>
          <div className={styles.courseTitle}>
            <input
              name="course_title"
              defaultValue={courseData.attributes.course_title}
              maxLength={32}
              required
            />
          </div>

          <div className={styles.courseInfo}>
            <p>Tufts Course Number</p>
            <input
              name="course_number_tufts"
              type="text"
              defaultValue={courseData.attributes.course_number_tufts}
              maxLength={32}
            ></input>

            <p>BHCC Course Number</p>
            <input
              name="course_number_bhcc"
              type="text"
              defaultValue={courseData.attributes.course_number_bhcc}
              maxLength={32}
            ></input>

            <p>Tufts Credits</p>
            <input
              name="credits_tufts"
              type="number"
              defaultValue={courseData.attributes.credits_tufts}
              min={0}
              max={2147483647}
              onWheel={(e) => e.currentTarget.blur()}
            ></input>

            <p>BHCC Credits</p>
            <input
              name="credits_bhcc"
              type="number"
              defaultValue={courseData.attributes.credits_bhcc}
              min={0}
              max={2147483647}
              onWheel={(e) => e.currentTarget.blur()}
            ></input>

            <p>Department</p>
            <select
              name="department"
              className={styles.select}
              defaultValue={courseData.attributes.department}
            >
              {depOpts.map((dep) => (
                <option key={dep.value} value={dep.value}>
                  {dep.name}
                </option>
              ))}
            </select>

            <p>Instructors</p>
            <div className={styles.fieldList}>
              {instructorsState.map((instructor, index) => (
                <div className={styles.instructorField} key={index}>
                  <input
                    onChange={(e) => updateInstructor(e, index)}
                    type="text"
                    value={instructor}
                    maxLength={32}
                    required
                  />
                  <div className={styles.removeButton} onClick={() => removeInstructor(index)}>
                    &#10005;
                  </div>
                </div>
              ))}
              <div className={styles.button} onClick={() => setShowInstructorSelector(true)}>
                Add Instructors
              </div>
            </div>

            <p>Prerequisites</p>
            <div className={styles.fieldList}>
              {prereqsState.map((course, index) => (
                <div className={styles.prereqField} key={index}>
                  <a href={course.id}>{course.title}</a>
                  <div className={styles.removeButton} onClick={() => removePrereq(index)}>
                    &#10005;
                  </div>
                </div>
              ))}
              <div className={styles.button} onClick={() => setShowCourseSelector(true)}>
                Add Prerequisties
              </div>
            </div>

            <p>Additional Information</p>
            <textarea
              name="additional_info"
              className={styles.additionalInfo}
              defaultValue={courseData.attributes.additional_info}
              maxLength={512}
            />

            <div className={styles.buttonBox}>
              <input className={styles.button} type="submit" value="Save" />
            </div>
          </div>
        </form>
      ) : (
        <h1>Loading...</h1>
      )}
      <InstructorSelector
        show={showInstructorSelector}
        writeFunction={addInstructor}
        onClose={() => setShowInstructorSelector(false)}
      />
      <CourseSelector
        show={showCourseSelector}
        writeFunction={addPrereq}
        onClose={() => setShowCourseSelector(false)}
      />
    </div>
  );
}
