import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/auth';
import { CourseSelector } from '../Selectors/CourseSelector';
import styles from './Creators.module.scss';

type CreateCourseProgressProps = {
  show: boolean;
  studentId: any;
  onClose: () => void;
};

export const CreateCourseProgress: React.FC<CreateCourseProgressProps> = (props) => {
  const defaultCourse = {
    course_title: null,
    id: null,
  };
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [currCourse, setCurrCourse] = useState(defaultCourse);
  const [showCourseSelector, setShowCourseSelector] = useState(false);

  useEffect(() => {
    setCurrCourse(defaultCourse);
  }, [props.show]);

  async function putCourseProgress(e) {
    e.preventDefault();
    if (currCourse.course_title == null) {
      alert('Please select a course');
      return;
    }
    let t = e.target;

    let url = 'http://127.0.0.1:8000/api/courseprogress/';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'CourseProgress',
          attributes: {
            grade: t.grade.value ? t.grade.value : null,
            year_taken: t.year_taken.value ? t.year_taken.value : null,
            semester_taken: t.semester_taken.value ? t.semester_taken.value : null,
            in_progress: t.in_progress.checked,
            student: `http://127.0.0.1:8000/api/students/${props.studentId}/`,
            course: `http://127.0.0.1:8000/api/course/${currCourse.id}/`,
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res) res.ok ? props.onClose() : res.json().then(console.log);
  }

  return props.show ? (
    <div className={styles.windowContainer}>
      <div className={styles.closeArea} onClick={props.onClose}></div>
      <div className={styles.popup}>
        <div className={styles.title}>Add Course Progress</div>
        <form className={styles.fields} onSubmit={putCourseProgress}>
          <div className={styles.field}>
            <div className={styles.fieldTitle}>Course</div>
            <div className={styles.fieldValue}>
              {currCourse.course_title}
              <div className={styles.button} onClick={() => setShowCourseSelector(true)}>
                {currCourse ? 'Change' : 'Select'}
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.fieldTitle}>Grade</div>
            <input
              type="number"
              name="grade"
              className={styles.fieldValue}
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
              onWheel={(e) => e.currentTarget.blur()}
              min={0}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldTitle}>
              Semester Taken
              <select name="semester_taken" className={styles.fieldValue}>
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
                defaultChecked={true}
              />
            </label>
          </div>

          <input type="submit" className={styles.button} />
          <button type="button" className={styles.button} onClick={props.onClose}>
            Cancel
          </button>
        </form>
      </div>
      <CourseSelector
        show={showCourseSelector}
        onClose={() => setShowCourseSelector(false)}
        writeFunction={setCurrCourse}
      />
    </div>
  ) : null;
};

export default CreateCourseProgress;
