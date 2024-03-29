import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/auth';
import { InstructorSelector } from '@/components/Selectors/InstructorSelector';
import { CourseSelector } from '@/components/Selectors/CourseSelector';
import styles from './[id].module.scss';

const ENDPOINT: string = 'http://127.0.0.1:8000/api/course/';

async function fetchCourseName(id) {
  const res = await fetch(`${ENDPOINT}${id}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).catch((err) => {
    alert('Error connecting to server');
    console.log(err);
  });

  return res;
}

export default function ViewClass() {
  const [courseData, setCourseData] = useState(null);
  const [showInstructorSelector, setShowInstructorSelector] = useState(false);
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [instructorsState, setInstructors] = useState([]);
  const [prereqsState, setPrereqs] = useState([]);
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const { register, handleSubmit, setValue } = useForm();

  /* Set placeholder */
  const [courseTitle, setCourseTitle] = useState(null);
  const [courseNumTufts, setCourseNumTufts] = useState(null);
  const [courseNumBHCC, setCourseNumBHCC] = useState(null);
  const [creditTufts, setCreditTufts] = useState(null);
  const [creditBHCC, setCreditBHCC] = useState(null);
  const [additionalInformation, setAdditionalInformation] = useState(null);

  /*
   * Fetch data associated with the course id. This also include prerequisites
   * and instructors
   */
  useEffect(() => {
    const setup = async () => {
      const res = await fetchCourseName(id);
      if (res && res.ok) {
        const data = await res.json();
        setCourseData(data.data);
        setInstructors(data.data.attributes.instructors);
        let prereqs = [];
        let ids = data.data.relationships.prereqs.data.map((i) => i.id);
        for (const id of ids) {
          const prereqRes = await fetchCourseName(id);
          if (prereqRes && prereqRes.ok) {
            const prereqData = await prereqRes.json();
            prereqs.push({ title: prereqData.data.attributes.course_title, id: id });
          }
        }
        setPrereqs(prereqs);

        /* Set existing data */
        const info = data.data.attributes;
        setValue('course_title', info.course_title ? info.course_title : '');
        setValue('course_num_tufts', info.course_number_tufts ? info.course_number_tufts : '');
        setValue('course_num_bhcc', info.course_number_bhcc ? info.course_number_bhcc : '');
        setValue('credits_tufts', info.credits_tufts);
        setValue('credits_bhcc', info.credits_bhcc);
        setValue('additional_info', info.additional_info ? info.additional_info : '');
        setValue('department', info.department ? info.department : '');
      } else {
        alert('Class not found');
        router.push('/');
      }
    };

    if (id) {
      setup();
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

  const onSubmitSuccess = async (data, e) => {
    e.preventDefault();
    const res = await fetch(`${ENDPOINT}${id}/`, {
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
            course_title: data.course_title,
            course_number_tufts: data.course_num_tufts,
            course_number_bhcc: data.course_num_bhcc,
            credits_tufts: data.credits_tufts ? parseInt(data.credits_tufts) : 0,
            credits_bhcc: data.credits_bhcc ? parseInt(data.credits_bhcc) : 0,
            department: data.department,
            instructors: instructorsState,
            prereqs: prereqsState.map((prereq) => `${ENDPOINT}${prereq.id}/`),
            additional_info: data.additional_info,
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res && res.ok) {
      alert('Successfully updated course information');
      router.push('/class');
    } else {
      alert('Error updating class information');
      console.log(res);
    }
  };

  const onSubmitFail = (e) => {
    Object.keys(e).forEach((key) => {
      console.log(e[key].message);
      setValue(key, '');
    });

    if (e.course_title) setCourseTitle(e.course_title.message);
    if (e.course_num_tufts) setCourseNumTufts('Can be at most 32 characters');
    if (e.course_num_bhcc) setCourseNumBHCC('Can be at most 32 characters');
    if (e.credits_tufts) setCreditTufts('Must be non-negative');
    if (e.credits_bhcc) setCreditBHCC('Must be non-negative');
    if (e.additional_info) setAdditionalInformation('Can be at most 512 characters');
    if (e.department) setAdditionalInformation('Can be at most 32 characters');
  };

  async function deleteCourse() {
    if (window.confirm('Are you sure you want to delete this course?')) {
      const res = await fetch(`${ENDPOINT}${id}/`, {
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

      if (res && res.ok) {
        alert('Successfully deleted course');
        router.push('/class');
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>Edit Course</div>
      <form onSubmit={handleSubmit(onSubmitSuccess, onSubmitFail)}>
        <div className={styles.row}>
          <label htmlFor="course_title">Course Title:</label>
          <input
            type="text"
            id="course_title"
            placeholder={courseTitle}
            {...register('course_title', {
              required: {
                value: true,
                message: 'Course title cannot be empty',
              },
              maxLength: {
                value: 32,
                message: 'Course title can be at most 32 characters',
              },
            })}
          />

          <label htmlFor="course_num_tufts">Tufts Course Number:</label>
          <input
            type="text"
            id="course_num_tufts"
            placeholder={courseNumTufts}
            {...register('course_num_tufts', {
              maxLength: {
                value: 32,
                message: 'Tufts course number can be at most 32 characters',
              },
            })}
          />

          <label htmlFor="course_num_bhcc">BHCC Course Number:</label>
          <input
            id="course_num_bhcc"
            type="text"
            placeholder={courseNumBHCC}
            {...register('course_num_bhcc', {
              maxLength: {
                value: 32,
                message: 'BHCC course number can be at most 32 characters',
              },
            })}
          />

          <label htmlFor="credits_tufts">Tufts Credits:</label>
          <input
            id="credits_tufts"
            type="text"
            placeholder={creditTufts}
            {...register('credits_tufts', {
              pattern: {
                value: /^\d+$/,
                message: 'Tufts credit must be a non-negative integer',
              },
            })}
          />

          <label htmlFor="credits_bhcc">BHCC Credits:</label>
          <input
            id="credits_bhcc"
            type="text"
            placeholder={creditBHCC}
            {...register('credits_bhcc', {
              pattern: {
                value: /^\d+$/,
                message: 'BHCC credit must be a non-negative integer',
              },
            })}
          />

          <label htmlFor="department">Department:</label>
          <input
            id="department"
            type="text"
            placeholder={courseNumBHCC}
            {...register('department', {
              maxLength: {
                value: 32,
                message: 'Department can be at most 32 characters',
              },
            })}
          />

          <label htmlFor="pre_req">Prerequisites:</label>
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

          <label htmlFor="instructors">Instructors:</label>
          <div className={styles.button} onClick={() => setShowInstructorSelector(true)}>
            <span>Add Instructor</span>
          </div>
          <div></div>
          <div>
            {instructorsState.map((instructor, index) => (
              <div className={styles.prereqField} key={index}>
                <input
                  type="text"
                  value={instructor}
                  maxLength={32}
                  onChange={(e) => updateInstructor(e, index)}
                  required
                />
                <div className={styles.removeButton} onClick={(e) => removeInstructor(index)}>
                  &#10005;
                </div>
              </div>
            ))}
          </div>

          <label htmlFor="additional_info">Additional Information:</label>
          <textarea
            id="additional_info"
            placeholder={additionalInformation}
            {...register('additional_info', {
              maxLength: {
                value: 512,
                message: 'Additional information can be at most 512 characters',
              },
            })}
          />
          <div></div>
          <input className={styles.button} type="submit" value="Submit" />
          <div></div>
          <input className={styles.button} type="button" value="Delete" onClick={deleteCourse} />
        </div>
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
