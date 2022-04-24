import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { useForm } from 'react-hook-form';
import styles from './add.module.scss';
import { useAuth } from '../../components/auth';
import { InstructorSelector } from '../../components/Selectors/InstructorSelector';
import { CourseSelector } from '../../components/Selectors/CourseSelector';

const ENDPOINT: string = 'http://127.0.0.1:8000/api/course/'

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
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetch(ENDPOINT, {
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

    fetch(ENDPOINT, {
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

  const onSubmitSuccess = async (data, e) => {
    e.preventDefault();
    const res = await fetch(ENDPOINT, {
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
            course_title: data.course_title,
            course_number_tufts: data.course_num_tufts,
            course_number_bhcc: data.course_num_bhcc,
            credits_tufts: data.credits_tufts,
            credits_bhcc: data.credits_bhcc,
            department: departments.get(data.department),
            instructors: instructorsState,
            prereqs: prereqsState.map((prereq) => `${ENDPOINT}${prereq.id}`),
            additional_info: data.additional_info
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res && res.ok) {
      const data = await res.json();
      console.log(data);
      Router.push('/class/[id]', `/class/${data.data.id}`);
    }
  };

  const onSubmitFail = (e) => {
    Object.keys(e).forEach((key) => {
      console.log(e[key].message);
    });
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
      <div className={styles.header}>Add Course</div>
      <form onSubmit={handleSubmit(onSubmitSuccess, onSubmitFail)}>
        <div className={styles.row}>
          <label htmlFor='course_title'>Course Title:</label>
          <input type='text' id='course_title'
           {...register('course_title', {
            required: {
              value: true,
              message: 'Course title cannot be empty'
            },
            maxLength: {
              value: 32,
              message: 'Course title can be at most 32 characters'
            }
          })}/>

          <label htmlFor='course_num_tufts'>Tufts Course Number:</label>
          <input type='text' id='course_num_tufts'
           {...register('course_num_tufts', {
             maxLength: {
               value: 32,
               message: 'Tufts course number can be at most 32 characters'
             }
           })}/>

          <label htmlFor='course_num_bhcc'>BHCC Course Number:</label>
          <input id='course_num_bhcc' type='text'
           {...register('course_num_bhcc', {
             maxLength: {
               value: 32,
               message: 'BHCC course number can be at most 32 characters'
             }
           })}/>

          <label htmlFor='credits_tufts'>Tufts Credits:</label>
          <input id='credits_tufts' type='text'
           {...register('credit_tufts', {
             pattern: {
               value: /^\d+$/,
               message: 'Tufts credit must be a non-negative integer'
             },
           })}/>

          <label htmlFor='credits_bhcc'>BHCC Credits:</label>
          <input id='credits_bhcc' type='text'
           {...register('credits_bhcc', {
             pattern: {
               value: /^\d+$/,
               message: 'BHCC credit must be a non-negative integer'
             },
           })}/>

          <label htmlFor='department'>Department</label>
          <select name='department' id='department' {...register('department')}>
            <option></option>
            {Array.from(departments.keys()).map((key) => (
              <option key={key}>{key}</option>
            ))}
          </select>

          <label htmlFor='pre_req'>Prerequisites:</label>
          <div className={styles.button} onClick={() => setShowCourseSelector(true)}>
            <span>Add Prerequisite</span>
          </div>
          <div></div>
          <div>
            {prereqsState.map((course, index) => (
              <div className={styles.prereqField} key={index}>
                <a href={course.id}>{course.title}</a>
                <div className={styles.removeButton} onClick={() => removePrereq(index)}>
                  &#10005;
                </div>
              </div>
            ))}
          </div>

          <label htmlFor='instructors'>Instructors:</label>
          <div className={styles.button} onClick={() => setShowInstructorSelector(true)}>
            <span>Add Instructor</span>
          </div>
          <div></div>
          <div>
            {instructorsState.map((instructor, index) => (
              <div className={styles.prereqField} key={index}>
                <input 
                 type='text'
                 value={instructor}
                 maxLength={32}
                 onChange={(e) => updateInstructor(e, index)}
                 required/>
                <div className={styles.removeButton} onClick={(e) => removeInstructor(index)}>
                  &#10005;
                </div>
              </div>
            ))}
          </div>

          <label htmlFor='additional_info'>Additional Information:</label>
          <textarea id='additional_info' {...register('additional_info', {
           maxLength: {
             value: 512,
             message: 'Additional information can be at most 512 characters'
           }
          })}/>

          <div className={styles.buttonBox}>
            <input className={styles.button} type='submit' value='Submit'/>
          </div>
        </div>
      </form>
      <InstructorSelector
        // style={styles.instructPopUp}
        show={showInstructorSelector}
        writeFunction={addInstructor}
        onClose={() => setShowInstructorSelector(false)}
      />
      <CourseSelector
        // style={styles.prereqPopUp}
        show={showCourseSelector}
        writeFunction={addPrereq}
        onClose={() => setShowCourseSelector(false)}
      />
    </div>
  );
}
