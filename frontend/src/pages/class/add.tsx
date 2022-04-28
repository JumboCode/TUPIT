import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import styles from './add.module.scss';
import { useAuth } from '@/components/auth';
import { InstructorSelector } from '@/components/Selectors/InstructorSelector';
import { CourseSelector } from '@/components/Selectors/CourseSelector';

interface Course {
  course_title: string;
  course_number_tufts: string;
  course_number_bhcc: string;
  credits_tufts: number;
  credits_bhcc: number;
  department: string;
  instructors: string[];
  prereqs: string[];
  additional_info: string;
}

export default function AddCourse() {
  // departments is a map from display name -> department abbreviation
  const [departments, setDepartments] = useState<Map<string, string> | undefined>(new Map());
  // courses is a map from name -> id
  const [courses, setCourses] = useState<Map<string, string> | undefined>(new Map());
  const [showInstructorSelector, setShowInstructorSelector] = useState(false);
  const [instructorsState, setInstructors] = useState([]);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [prereqsState, setPrereqs] = useState([]);
  const { isLoggedIn, csrfToken, login, logout } = useAuth();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/course/', {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => {
        const departments = new Map<string, string>(
          res.data.actions.POST.department.choices.map((x) => [x.display_name, x.value])
        );
        console.log(departments.keys());
        setDepartments(departments);
      })
      .catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });

    fetch('http://127.0.0.1:8000/api/course/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((res) => {
        const courses = new Map<string, string>(
          res.data.map((x) => [x.attributes.course_title, x.id])
        );
        setCourses(courses);
      })
      .catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });
  }, []);

  const submit = async (event) => {
    event.preventDefault();

    let newCourse: Course = {} as Course;

    newCourse.course_title = event.target.course_title.value;
    newCourse.course_number_tufts = event.target.course_number_tufts.value;
    newCourse.course_number_bhcc = event.target.course_number_bhcc.value;
    newCourse.credits_tufts = event.target.credits_tufts.value
      ? event.target.credits_tufts.value
      : 0;
    newCourse.credits_bhcc = event.target.credits_bhcc.value ? event.target.credits_bhcc.value : 0;
    newCourse.department = departments.get(event.target.department.value);
    newCourse.prereqs = prereqsState.map(
      (prereq) => `http://127.0.0.1:8000/api/course/${prereq.id}/`
    );
    // console.log('this is the department', newCourse.department, event.target.department.value);
    // console.log('this is the newcourse', newCourse);
    newCourse.instructors = instructorsState;
    newCourse.additional_info = event.target.additional_info.value;

    const res = await fetch('http://127.0.0.1:8000/api/course/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Course',
          attributes: {
            course_title: newCourse.course_title,
            course_number_tufts: newCourse.course_number_tufts,
            course_number_bhcc: newCourse.course_number_bhcc,
            credits_tufts: newCourse.credits_tufts,
            credits_bhcc: newCourse.credits_bhcc,
            department: newCourse.department,
            instructors: newCourse.instructors,
            prereqs: newCourse.prereqs,
            additional_info: newCourse.additional_info,
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res) {
      const data = await res.json();
      Router.push('/class/[id]', `/class/${data.data.id}`);
    }
  };

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

  return (
    <div className={styles.container}>
      <form onSubmit={submit} className={styles.formContainer}>
        <span className={styles.title}>Add Course</span>
        <div className={styles.row}>
          <span>Course Title</span>
          <input type="text" id="course_title" />
        </div>
        <div className={styles.row}>
          <span>Tufts Course Number</span>
          <input type="text" id="course_number_tufts" />
        </div>
        <div className={styles.row}>
          <span>BHCC Course Number</span>
          <input id="course_number_bhcc" type="text" />
        </div>
        <div className={styles.row}>
          <span>Tufts Credits</span>
          <input id="credits_tufts" type="number" onWheel={(e) => e.currentTarget.blur()} />
        </div>
        <div className={styles.row}>
          <span>BHCC Credits</span>
          <input id="credits_bhcc" type="number" onWheel={(e) => e.currentTarget.blur()} />
        </div>
        <div className={styles.row}>
          <span>Department</span>
          <select name="department" id="department" size={1}>
            {Array.from(departments.keys()).map((key) => (
              <option> {key} </option>
            ))}
          </select>
        </div>
        <div className={styles.row}>
          <span>Prereqs</span>
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
              +
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <span>Instructors</span>
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
              <>+</>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <span>Additional Information</span>
          <textarea id="additional_info" maxLength={512} />
        </div>
        <input className={styles.button} type="submit" value="Submit" />
      </form>
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
