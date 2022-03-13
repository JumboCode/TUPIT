import React, { useEffect, useState, createRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import { CourseProgressModifier } from '../../components/Modifiers/CourseProgressModifier';
import { CreateCourseProgress } from '../../components/Creators/CreateCourseProgress';
import styles from './[id].module.scss';
import FileViewer from 'src/components/FileViewer/FileViewer';

async function fetchCourseName(id) {
  let url = `http://127.0.0.1:8000/api/course/${id}/`;
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

export default function ViewStudent() {
  const [studentData, setStudentData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [courseProg, setCourseProg] = useState([]);
  const [barWidth, setBarWidth] = useState({
    comp: {
      width: 0,
      num: 0,
    },
    prog: {
      width: 0,
      num: 0,
    },
  });
  const [editCourseId, setEditCourseId] = useState(null);
  const [editCourseTitle, setEditCourseTitle] = useState(null);
  const [showCourseModifier, setShowCourseModifier] = useState(false);
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const compBar = createRef<HTMLDivElement>();
  const inProgBar = createRef<HTMLDivElement>();

  useEffect(() => {
    if (id) {
      fetchStudentInfo();
      fetchCourseProgress();
    }
  }, [id]);

  useEffect(() => {
    compBar.current.style.width = barWidth.comp.width + '%';
    compBar.current.innerText = 'Completed: ' + barWidth.comp.num;
    inProgBar.current.style.width = barWidth.prog.width + '%';
    inProgBar.current.innerText = 'In Progress: ' + barWidth.prog.num;
  }, [barWidth]);

  async function fetchStudentInfo() {
    let url = `http://127.0.0.1:8000/api/students/${id}/`;
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
      if (res.ok) res.json().then((data) => setStudentData(data.data));
      else {
        alert('Student not found');
        router.push('/student');
      }
  }

  async function fetchCourseProgress() {
    let url = `http://127.0.0.1:8000/api/courseprogress/?student=${id}`;
    let res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res && res.ok) {
      const data = await res.json();
      let progWithCourseTitles = [];
      for (let courseProg of data.data) {
        const course_id = courseProg.relationships.course.data.id;
        progWithCourseTitles.push({
          ...courseProg,
          course_title: await fetchCourseName(course_id),
        });
      }
      progWithCourseTitles.sort((a, b) => {
        if (a.attributes.in_progress != b.attributes.in_progress)
          return a.attributes.in_progress ? -1 : 1;
        if (a.attributes.year_taken != b.attributes.year_taken)
          return a.attributes.year_taken < b.attributes.year_taken ? 1 : -1;
        return a.course_title > b.course_title ? 1 : -1;
      });
      setCourseProg(progWithCourseTitles);
    }

    url = 'http://127.0.0.1:8000/audit-student/';
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        student_id: id,
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res && res.ok) {
      const data = await res.json();
      // set width of progress bar
      const completed = data.completed.length;
      const inProg = data.in_progress.length;
      const total = completed + inProg + data.not_completed.length;

      const inProgWidth = (inProg / total) * 100;
      const compWidth = (completed / total) * 100;
      setBarWidth({
        comp: {
          width: compWidth,
          num: completed,
        },
        prog: {
          width: inProgWidth,
          num: inProg,
        },
      });
    }
  }

  async function putStudentInfo(e) {
    e.preventDefault();

    const t = e.target;
    const url = `http://127.0.0.1:8000/api/students/${id}/`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Student',
          id: id,
          attributes: {
            firstname: t.firstname.value,
            lastname: t.lastname.value,
            birthday: t.birthday.value ? t.birthday.value : null,
            doc_num: t.doc_num.value,
            tufts_num: t.tufts_num.value,
            bhcc_num: t.bhcc_num.value,
            cohort: parseInt(t.cohort.value),
            parole_status: t.parole_status.value,
            student_status: t.student_status.value,
            years_given: parseInt(t.years_given.value),
            years_left: parseInt(t.years_left.value),
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
        alert('Successfully updated student info');
        router.push('/student');
      } else {
        alert('Error updating student info');
        res.json().then((data) => console.log(data));
      }
  }

  async function deleteStudent() {
    if (window.confirm('Are you sure you want to delete this student?')) {
      let url = `http://127.0.0.1:8000/api/students/${id}/`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      }).catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });

      if (res)
        if (res.ok) {
          alert('Successfully deleted student');
          router.push('/student');
        } else {
          alert('Error deleting student');
          res.json().then((data) => console.log(data));
        }
    }
  }

  const expandButton = (
    <div className={styles.button} onClick={() => setIsExpanded(!isExpanded)}>
      <span>{isExpanded ? '▲' : '▼'}</span>
      <span>{(isExpanded ? 'Hide' : 'Show') + ' details'}</span>
      <span>{isExpanded ? '▲' : '▼'}</span>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.col}>
        {studentData ? (
          <form className={styles.studentInfo} onSubmit={putStudentInfo}>
            <div className={styles.row}>
              <p>Name</p>
              <div>
                <input name="firstname" defaultValue={studentData.attributes.firstname} />
                <input name="lastname" defaultValue={studentData.attributes.lastname} />
              </div>
            </div>

            <div className={styles.row}>
              <p>Cohort</p>
              <input
                name="cohort"
                type="number"
                defaultValue={studentData.attributes.cohort}
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
              />
            </div>

            {expandButton}

            <div className={isExpanded ? styles.expanded : styles.condensed}>
              <div className={styles.row}>
                <p>Birthday</p>
                <input name="birthday" type="date" defaultValue={studentData.attributes.birthday} />
              </div>

              <div className={styles.row}>
                <p>DOC Number</p>
                <input
                  name="doc_num"
                  type="text"
                  defaultValue={studentData.attributes.doc_num}
                  pattern="W\d+"
                  required
                />
              </div>

              <div className={styles.row}>
                <p>Tufts Number</p>
                <input
                  name="tufts_num"
                  type="text"
                  defaultValue={studentData.attributes.tufts_num}
                  maxLength={7}
                  minLength={7}
                  required
                />
              </div>

              <div className={styles.row}>
                <p>BHCC Number</p>
                <input
                  name="bhcc_num"
                  type="text"
                  defaultValue={studentData.attributes.bhcc_num}
                  maxLength={32}
                />
              </div>

              <div className={styles.row}>
                <p>Parole Status</p>
                <textarea
                  name="parole_status"
                  defaultValue={studentData.attributes.parole_status}
                  maxLength={256}
                />
              </div>

              <div className={styles.row}>
                <p>Student Status</p>
                <textarea
                  name="student_status"
                  defaultValue={studentData.attributes.student_status}
                  maxLength={256}
                />
              </div>

              <div className={styles.row}>
                <p>Years Given</p>
                <input
                  name="years_given"
                  type="number"
                  defaultValue={studentData.attributes.years_given}
                  onWheel={(e) => e.currentTarget.blur()}
                  min={0}
                />
              </div>

              <div className={styles.row}>
                <p>Years Left</p>
                <input
                  name="years_left"
                  type="number"
                  defaultValue={studentData.attributes.years_left}
                  onWheel={(e) => e.currentTarget.blur()}
                  min={0}
                />
              </div>

              <div className={styles.row}>
                <p>Additional Information</p>
                <textarea
                  name="additional_info"
                  defaultValue={studentData.attributes.additional_info}
                  maxLength={512}
                />
              </div>

              {expandButton}
            </div>

            <input className={styles.button} type="submit" value="Save" />
            <button className={styles.button} onClick={() => router.push('/student')} type="button">
              Cancel
            </button>
            <button className={styles.button} onClick={deleteStudent} type="button">
              Delete
            </button>
          </form>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>

      <div className={styles.col}>
        <div className={styles.studentInfo}>
          <div className={styles.row}>
            <p>Progress Towards Degree</p>

            <div className={styles.progBar}>
              <div className={styles.compBar} ref={compBar} />
              <div className={styles.inProgBar} ref={inProgBar} />
            </div>
          </div>

          <div className={styles.row}>
            <p>Courses</p>
            <div className={styles.courseEntries}>
              {courseProg.map((course) => (
                <div
                  key={course.id}
                  className={styles.courseEntry}
                  onClick={() => {
                    setEditCourseId(course.id);
                    setEditCourseTitle(course.course_title);
                    setShowCourseModifier(true);
                  }}
                >
                  <div className={styles.courseTitle}>
                    {course.course_title}
                    {course.attributes.in_progress ? (
                      <div className={styles.inProgText}>in progress</div>
                    ) : null}
                  </div>
                  <div className={styles.courseInfo}>
                    <div>Grade: {course.attributes.grade}</div>
                    <div>
                      {course.attributes.semester_taken} {course.attributes.year_taken}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={styles.button}
              onClick={() => {
                setShowCourseCreator(true);
              }}
            >
              +
            </button>
          </div>

          <div className={styles.row}>
            <FileViewer {...studentData} />
          </div>
        </div>
      </div>
      <CourseProgressModifier
        show={showCourseModifier}
        id={editCourseId}
        courseTitle={editCourseTitle}
        onClose={() => {
          setShowCourseModifier(false);
          fetchCourseProgress();
          setEditCourseId(null);
        }}
      />
      <CreateCourseProgress
        show={showCourseCreator}
        studentId={id}
        onClose={() => {
          setShowCourseCreator(false);
          fetchCourseProgress();
        }}
      />
    </div>
  );
}
