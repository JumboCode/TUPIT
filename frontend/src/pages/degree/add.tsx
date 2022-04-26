import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/auth';
import CourseSelector from '@/components/Selectors/CourseSelector';
import styles from './add.module.scss';

const COURSE_ENDPOINT: string = 'http://127.0.0.1:8000/api/course/';
const DEGREE_ENDPOINT: string = 'http://127.0.0.1:8000/api/degree/';
const ACTIVE_ENDPOINT: string = 'http://127.0.0.1:8000/set-active-degree/';

const getData = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).catch((err) => {
    alert('Error connecting to server');
  });
  return res;
};

const addDegree = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const [showCourseSelector, setShowCourseSelector] = useState(false);
  const [prereqsState, setPrereqs] = useState([]);

  /* Placeholder */
  const [degreeName, setDegreeName] = useState(null);
  const [additionalInformation, setAdditionalInformation] = useState(null);

  const addPrereq = (course) => {
    setPrereqs(
      [...prereqsState, { title: course.course_title, id: course.id }]
    );
  };

  const removePrereq = (index: number) => {
    let newPrereqs = [...prereqsState];
    newPrereqs.splice(index, 1);
    setPrereqs(newPrereqs);
  };

  const onSubmitSuccess = async (data, e) => {
    e.preventDefault();
    const res = await fetch(DEGREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken
      },
      credentials: 'include', 
      body: JSON.stringify({
        data: {
          type: 'Degree',
          attributes: {
            degree_name: data.degreeName,
            active: data.active,
            reqs: prereqsState.map((req) => `${COURSE_ENDPOINT}/${req.id}`),
            is_tufts: data.university == 'Tufts' ? true : false,
            additional_info: data.additionalInformation
          }
        }
      })
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    if (res) {
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        if (data.active)
          fetch(ACTIVE_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify({
              degree_id: data.data.id,
            }),
          }).catch((err) => {
            alert('Error connecting to server');
            console.log(err);
          });

        alert('Degree added successfully');
        router.push('/degree/[id]', `/degree/${data.data.id}`);
      } else {
        alert('Error adding degree');
      }
    }
  };

  const onSubmitFail = (e) => {
    Object.keys(e).forEach((key) => {
      console.log(e[key].message);
      setValue(key, '');
    });

    if (e.degreeName) setDegreeName(e.degreeName.message);
    if (e.additionalInformation) setAdditionalInformation(e.additionalInformation.message); 
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Add Degree</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmitSuccess, onSubmitFail)}>
        <div className={styles.row}>
          <label htmlFor='degreeName'>Degree:</label>
          <input type='text' placeholder={degreeName} {...register('degreeName', {
            required: {
              value: true,
              message: 'Degree name cannot be empty'
            },
            maxLength: {
              value: 32,
              message: 'Degree name can be at most 32 characters'
            }
          })}/>
          <label htmlFor='active'>Active:</label>
          <input id='active' className={styles.checkbox} type='checkbox'
           {...register('active')}/>
          <label htmlFor='university'>University:</label>
          <select id='university' defaultValue={'Tufts'} {...register('university', {
            required: {
              value: true,
              message: "Degree's university provider must not be empty"
            }
          })}>
            <option value='Tufts'>Tufts</option>
            <option value='Bunker Hill'>Bunker Hill</option>
          </select>
          <label htmlFor='requirement'>Requirements:</label>
          <div className={styles.button} onClick={() => setShowCourseSelector(true)}>
            Add Prerequisites
          </div>
          <div></div>
          <div className={styles.fieldList}>
            {prereqsState.map((course, index) => (
              <div className={styles.prereqField} key={index}>
                <a href={course.id}>{course.title}</a>
                <div className={styles.removeButton} onClick={() => removePrereq(index)}>
                  &#10005;
                </div>
              </div>
            ))}
          </div>
          <label htmlFor='additionalInformation'>Additional Information:</label>
          <textarea id='additionalInformation' placeholder={additionalInformation}
           {...register('additionalInformation', {
             maxLength: {
               value: 512,
               message: 'Additional information can be at most 512 characters'
             }
           })}/>
          <div></div>
          <input className={styles.button} type='submit' value='Save'/>
        </div>
      </form>
      <CourseSelector
       show={showCourseSelector}
       writeFunction={addPrereq}
       onClose={() => setShowCourseSelector(false)}/>
    </div>
  );
};

export default addDegree;