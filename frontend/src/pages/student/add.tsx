import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../components/auth';
import styles from './add.module.scss';

const ENDPOINT: string = 'http://127.0.0.1:8000/api/students/';

const addStudent = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const { register, handleSubmit, formState: { errors }} = useForm();
  const router = useRouter();

  const onSubmitSuccess = (data, e) => {
    e.preventDefault();
    (async function() {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'X-CSRFToken': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
          data: {
            type: 'Student',
            attributes: {
              firstname: data.firstName,
              lastname: data.lastName,
              birthday: data.birthday,
              ssn: data.ssn,
              cohort: data.cohort == NaN ? null : data.cohort,
              doc_num: data.docNum,
              tufts_num: data.tuftsNum,
              bhcc_num: data.bhccNum,
              years_given: data.yearsGiven,
              years_left: data.yearsLeft,
              parole_status: data.paroleStatus,
              student_status: data.studentStatus,
              additional_info: data.additionalInformation
            }
          }
        })
      }).catch((err) => {
        alert('Error connecting to server');
        console.log(err);
      });

      if (res) {
        if (res.ok) {
          alert('Student created successfully');
          res.json().then((data) => router.push(`/student/${data.data.id}`));
        } else {
          alert('Error creating student');
          console.log(res);
          res.json().then((response) => console.log(response));
        }
      }
    })();
  };

  const onSubmitFail = (e) => {
    Object.keys(e).forEach((key) => {
      console.log(e[key].message);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          New Student
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmitSuccess, onSubmitFail)}>
        <div className={styles.row}>
          <label htmlFor='firstName'>First name:</label> 
          <input id='firstName' type='text'
           {...register('firstName', {
            maxLength: {
              value: 32,
              message: 'First name can be at most 32 characters long'
            }
           })}/>
          <label htmlFor='lastName'>Last name:</label> 
          <input id='lastName' type='text'
           {...register('lastName', {
            maxLength: {
              value: 32,
              message: 'Last name can be at most 32 characters long'
            }
           })}/>
          <label htmlFor='birthday'>Birthday:</label>
          <input id='birthday' type='date' {...register('birthday')}/>
          <label htmlFor='ssn'>SSN (last 4 digits):</label>
          <input id='ssn' type='text'
           {...register('ssn', {
            required: {
              value: true,
              message: 'SSN must not be empty'
            },
            pattern: {
              value: /^\d{4}$/,
              message: 'SSN must be the last 4 digits'
            }
           })}/>
        </div>
        <div className={styles.row}>
          <label htmlFor='cohort'>Cohort:</label>
          <input id='cohort' type='text'
           {...register('cohort', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Cohort must be a non-negative integer'
            }
           })}/>
          <label htmlFor='docNum'>DOC Number:</label>
          <input id='docNum' type='text'
           {...register('docNum', {
            required: {
              value: true,
              message: 'Document number must not be empty'
            },
            maxLength: {
              value: 32,
              message: 'Document number can be at most 32 characters long'
            },
            pattern: {
              value: /^W\d+$/,
              message: 'Document number must start with W and follow with digits'
            }
           })}/>
          <label htmlFor='tuftsNum'>Tufts Number:</label>
          <input id='tuftsNum' type='text'
           {...register('tuftsNum', {
            required: {
              value: true,
              message: 'Tufts number must not be empty'
            },
            pattern: {
              value: /^[\w\d]{7}$/,
              message: 'Tufts number must be 7 characters long'
            }
           })
           }/>
          <label htmlFor='bhccNum'>BHCC Number:</label>
          <input id='bhccNum' type='text'
           {...register('bhccNum', {
            maxLength: {
              value: 32,
              message: 'Bunker Hill number can be at most 32 characters long'
            }
           })}/>
          <label htmlFor='yearsGiven'>Years Given:</label>
          <input id='yearsGiven' type='text'
           {...register('yearsGiven', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Years given must be a non-negative number'
            }
           })}/>
          <label htmlFor='yearsLeft'>Years Left:</label>
          <input id='yearsLeft' type='text'
           {...register('yearsLeft', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: 'Years left must be a non-negative number'
            }
           })}/>
        </div>
        <div className={styles.row}>
          <label htmlFor='paroleStatus'>Parole Status:</label>
          <textarea id='paroleStatus'
           {...register('paroleStatus', {
            maxLength: {
              value: 256,
              message: 'Parole status can be at most 256 characters'
            }
           })}/>
          <label htmlFor='studentStatus'>Student Status:</label>
          <textarea id='studentStatus'
           {...register('studentStatus', {
            maxLength: {
              value: 256,
              message: 'Student status can be at most 256 characters'
            }
           })}/>
          <label htmlFor='additionalInformation'>Additional Information:</label>
          <textarea id='additionalInformation'
           {...register('additionalInformation', {
            maxLength: {
              value: 256,
              message: 'Additional information can be at most 256 characters'
            }
           })}/>
          <div></div> 
          <div className={styles.button}>
            <input type='submit' value='Save'/> 
            <input type='button' value='Cancel' onClick={() => router.push('/student')}/>
          </div>
        </div>
      </form>
    </div>
  )
};

export default addStudent;