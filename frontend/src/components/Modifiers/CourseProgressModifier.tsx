import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth';
import { CourseSelector } from '../Selectors/CourseSelector';
import styles from './Modifiers.module.scss';

type CourseProgressModifierProps = {
  show: boolean;
  id: number;
  courseTitle: string;
  onClose: () => void;
};

async function fetchCourseName(id) {
  let url = 'http://127.0.0.1:8000/api/course/' + id + '/';
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }).catch((err) => {
    console.log(err);
    alert('Error connecting to server');
  });
  if (res) {
    const course_name = await res.json().then((data) => data.data.attributes.course_title);
    return course_name;
  } else return null;
}

export const CourseProgressModifier: React.FC<CourseProgressModifierProps> = (props) => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [progData, setProgData] = useState(null);
  const [currCourse, setCurrCourse] = useState({
    course_title: null,
    id: null,
  });
  const [showCourseSelector, setShowCourseSelector] = useState(false);

  useEffect(() => {
    async function getProgressData() {
      setProgData(null);

      let url = `http://127.0.0.1:8000/api/courseprogress/${props.id}/`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).catch((err) => {
        alert('Error connecting to server');
        console.log(err);
        props.onClose();
      });

      if (res) {
        if (res.ok) {
          const data = await res.json();
          setProgData(data.data);
          let id = data.data.relationships.course.data.id;
          let course_title = await fetchCourseName(id);
          setCurrCourse({
            course_title: course_title,
            id: id,
          });
        } else {
          alert('Error getting course info');
          console.log(res);
          props.onClose();
        }
      }
    }

    if (props.id) getProgressData();
  }, [props.id]);

  async function putCourseProgress(e) {
    e.preventDefault();

    let t = e.target;
    let url = `http://127.0.0.1:8000/api/courseprogress/${props.id}/`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'CourseProgress',
          id: props.id,
          attributes: {
            grade: t.grade.value ? t.grade.value : null,
            year_taken: t.year_taken.value ? t.year_taken.value : null,
            semester_taken: t.semester_taken.value ? t.semester_taken.value : null,
            in_progress: t.in_progress.checked,
            course: `http://127.0.0.1:8000/api/course/${currCourse.id}/`,
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res)
      if (res.ok) props.onClose();
      else {
        alert('Error updating course progress');
        res.json().then((data) => console.log(data));
      }
  }

  async function deleteCourseProgress() {
    if (confirm('Delete this course progress?')) {
      let url = `http://127.0.0.1:8000/api/courseprogress/${props.id}/`;
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
        if (res.ok) props.onClose();
        else {
          alert('Error deleting course progress');
          console.log(res);
        }
    }
  }

  return props.show ? (
    <div className={styles.windowContainer}>
      <div className={styles.closeArea} onClick={props.onClose}></div>
      {progData ? (
        <div className={styles.popup}>
          <div className={styles.title}>Modify Course Progress</div>
          <form className={styles.fields} onSubmit={putCourseProgress}>
            <div className={styles.field}>
              <div className={styles.fieldTitle}>Course</div>
              <div className={styles.fieldValue}>
                {currCourse.course_title}
                <div className={styles.button} onClick={() => setShowCourseSelector(true)}>
                  Change
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldTitle}>Grade</div>
              <input
                type="number"
                name="grade"
                className={styles.fieldValue}
                defaultValue={progData && progData.attributes.grade}
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldTitle}>Year Taken</div>
              <input
                type="number"
                name="year_taken"
                className={styles.fieldValue}
                defaultValue={progData && progData.attributes.year_taken}
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldTitle}>
                Semester Taken
                <select
                  name="semester_taken"
                  className={styles.fieldValue}
                  defaultValue={progData.attributes.semester_taken}
                >
                  <option value="Fall">Fall</option>
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                </select>
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldTitle}>
                In progress
                <input
                  type="checkbox"
                  name="in_progress"
                  className={styles.fieldValue}
                  defaultChecked={progData && progData.attributes.in_progress}
                />
              </label>
            </div>

            <input type="submit" className={styles.button} />
            <button type="button" className={styles.button} onClick={deleteCourseProgress}>
              Delete
            </button>
          </form>
        </div>
      ) : null}
      <CourseSelector
        show={showCourseSelector}
        onClose={() => setShowCourseSelector(false)}
        writeFunction={setCurrCourse}
      />
    </div>
  ) : null;
};

export default CourseProgressModifier;
