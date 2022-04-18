import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './add.module.scss';

const addStudent = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.header}>New Student</div>
      <form>
        <div className={styles.columns}>
          <label htmlFor="firstName">First name:</label>
          <input id="firstName" type="text" />
          <label htmlFor="lastName">Last name:</label>
          <input id="lastName" type="text" />
          <label htmlFor="cohort">Cohort:</label>
          <input id="cohort" type="text" />
          <label htmlFor="birthday">Birthday:</label>
          <input id="birthday" type="date" />
          <label htmlFor="docNum">DOC Number:</label>
          <input id="docNum" type="text" />
          <label htmlFor="tuftsNum">Tufts Number:</label>
          <input id="tuftsNum" type="text" />
          <label htmlFor="bhccNum">BHCC Number:</label>
          <input id="bhccNum" type="text" />
          <label htmlFor="ssn">SSN (last 4 digits):</label>
          <input id="ssn" type="text" />
          <label htmlFor="paroleStatus">Parole Status:</label>
          <textarea id="paroleStatus" />
          <label htmlFor="studentStatus">Student Status:</label>
          <textarea id="studentStatus" />
          <label htmlFor="yearsGiven">Years Given:</label>
          <input id="yearsGiven" type="text" />
          <label htmlFor="yearsLeft">Years Left:</label>
          <input id="yearsLeft" type="text" />
          <label htmlFor="additionalInformation">Additional Information:</label>
          <textarea className={styles.info} id="additionalInformation" />
          <div className={styles.button}>
            <input type="submit" value="Submit" />
          </div>
        </div>
      </form>
    </div>
  );
};

/* <label htmlFor='firstName'>First name:</label> 
<label htmlFor='lastName'>Last name:</label> 
<label htmlFor='cohort'>Cohort:</label>
<label htmlFor='birthday'>Birthday:</label>
<label htmlFor='docNum'>DOC Number:</label>
<label htmlFor='tuftsNum'>Tufts Number:</label>
<label htmlFor='bhccNum'>BHCC Number:</label>
<label htmlFor='ssn'>SSN (last 4 digits):</label>
<label htmlFor='paroleStatus'>Parole Status:</label>
<label htmlFor='studentStatus'>Student Status:</label>
<label htmlFor='yearsGiven'>Years Given:</label>
<label htmlFor='yearsLeft'>Years Left:</label>
<label htmlFor='additionalInformation'>Additional Information:</label>
<input id='firstName' type='text'/>
<input id='lastName' type='text'/>
<input id='cohort' type='text'/>
<input id='birthday' type='date'/>
<input id='docNum' type='text'/>
<input id='tuftsNum' type='text'/>
<input id='bhccNum' type='text'/>
<input id='ssn' type='text'/>
<textarea id='paroleStatus'/>
<textarea id='studentStatus'/>
<input id='yearsGiven' type='text'/>
<input id='yearsLeft' type='text'/>
<textarea id='additionalInformation'/> */

// <div className={styles.row}>
// <span className={styles.item}>
//     <label htmlFor='firstName'>First name:</label>
//     <input id='firstName' type='text'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='lastName'>Last name:</label>
//     <input id='lastName' type='text'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='cohort'>Cohort:</label>
//     <input id='cohort' type='text'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='birthday'>Birthday:</label>
//     <input id='birthday' type='date'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='docNum'>DOC Number:</label>
//     <input id='docNum' type='text'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='tuftsNum'>Tufts Number:</label>
//     <input id='tuftsNum' type='text'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='bhccNum'>BHCC Number:</label>
//     <input id='bhccNum' type='text'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='ssn'>SSN (last 4 digits):</label>
//     <input id='ssn' type='text'/>
// </span>
// </div>
// <div className={styles.row}>
// <span className={styles.item}>
//     <label htmlFor='paroleStatus'>Parole Status:</label>
//     <textarea id='paroleStatus'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='studentStatus'>Student Status:</label>
//     <textarea id='studentStatus'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='yearsGiven'>Years Given:</label>
//     <input id='yearsGiven' type='text'/>
// </span>
// <span className={styles.item}>
//     <label htmlFor='yearsLeft'>Years Left:</label>
//     <input id='yearsLeft' type='text'/>
// </span>
// </div>
// <div className={styles.footer}>
//     <span className={styles.item}>
//             <label htmlFor='additionalInformation'>Additional Information:</label>
//             <textarea id='additionalInformation'/>
//     </span>
// </div>

export default addStudent;
