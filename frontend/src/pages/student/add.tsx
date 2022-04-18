import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './add.module.scss';

const addStudent = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const router = useRouter();
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        New Student
      </div>
      <form>
        <div className={styles.row}>
          <label htmlFor='firstName'>First name:</label> 
          <input id='firstName' type='text'/>
          <label htmlFor='lastName'>Last name:</label> 
          <input id='lastName' type='text'/>
          <label htmlFor='cohort'>Cohort:</label>
          <input id='cohort' type='text'/>
          <label htmlFor='birthday'>Birthday:</label>
          <input id='birthday' type='date'/>
          <label htmlFor='docNum'>DOC Number:</label>
          <input id='docNum' type='text'/>
          <label htmlFor='tuftsNum'>Tufts Number:</label>
          <input id='tuftsNum' type='text'/>
          <label htmlFor='bhccNum'>BHCC Number:</label>
          <input id='bhccNum' type='text'/>
          <label htmlFor='ssn'>SSN (last 4 digits):</label>
          <input id='ssn' type='text'/>
          <label htmlFor='paroleStatus'>Parole Status:</label>
          <textarea id='paroleStatus'/>
          <label htmlFor='studentStatus'>Student Status:</label>
          <textarea id='studentStatus'/>
          <label htmlFor='yearsGiven'>Years Given:</label>
          <input id='yearsGiven' type='text'/>
          <label htmlFor='yearsLeft'>Years Left:</label>
          <input id='yearsLeft' type='text'/>
          <label htmlFor='additionalInformation'>Additional Information:</label>
          <textarea id='additionalInformation'/>
        </div>
      </form>
    </div>
  )
};

export default addStudent;
// export default function AddStudent() {
//   const { isLoggedIn, csrfToken, login, logout } = useAuth();
//   const router = useRouter();

//   async function handleSubmit(e) {
//     e.preventDefault();

//     const t = e.target;
//     const url = 'http://127.0.0.1:8000/api/students/';
//     const res = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/vnd.api+json',
//         'X-CSRFToken': csrfToken,
//       },
//       credentials: 'include',
//       body: JSON.stringify({
//         data: {
//           type: 'Student',
//           attributes: {
//             firstname: t.firstname.value,
//             lastname: t.lastname.value,
//             birthday: t.birthday.value ? t.birthday.value : null,
//             doc_num: t.doc_num.value,
//             tufts_num: t.tufts_num.value,
//             bhcc_num: t.bhcc_num.value,
//             ssn: t.ssn.value,
//             cohort: parseInt(t.cohort.value),
//             parole_status: t.parole_status.value,
//             student_status: t.student_status.value,
//             years_given: parseInt(t.years_given.value),
//             years_left: parseInt(t.years_left.value),
//             additional_info: t.additional_info.value,
//           },
//         },
//       }),
//     }).catch((err) => {
//       alert('Error connecting to server');
//       console.log(err);
//     });

//     if (res)
//       if (res.ok) {
//         alert('Student created successfully');
//         res.json().then((data) => router.push(`/student/${data.data.id}`));
//       } else {
//         alert('Error creating student');
//         console.log(res);
//         res.json().then((resp) => console.log(resp));
//       }
//   }

//   return (
//     <div className={styles.container}>
//       <form className={styles.studentInfo} onSubmit={handleSubmit}>
//         <div className={styles.title}>New Student</div>

//         <div className={styles.row}>
//           <p>Name</p>
//           <div>
//             <input name="firstname" placeholder="First Name" />
//             <input name="lastname" placeholder="Last Name" />
//           </div>
//         </div>

//         <div className={styles.row}>
//           <p>Cohort</p>
//           <input name="cohort" type="number" onWheel={(e) => e.currentTarget.blur()} min={0} />
//         </div>

//         <div className={styles.row}>
//           <p>Birthday</p>
//           <input name="birthday" type="date" />
//         </div>

//         <div className={styles.row}>
//           <p>DOC Number</p>
//           <input name="doc_num" type="text" pattern="W\d+" required />
//         </div>

//         <div className={styles.row}>
//           <p>Tufts Number</p>
//           <input name="tufts_num" type="text" maxLength={7} minLength={7} required />
//         </div>

//         <div className={styles.row}>
//           <p>BHCC Number</p>
//           <input name="bhcc_num" type="text" maxLength={32} />
//         </div>

//         <div className={styles.row}>
//           <p>SSN (last 4 digits)</p>
//           <input name="ssn" type="text" maxLength={4} minLength={4} required />
//         </div>

//         <div className={styles.row}>
//           <p>Parole Status</p>
//           <textarea name="parole_status" maxLength={256} />
//         </div>

//         <div className={styles.row}>
//           <p>Student Status</p>
//           <textarea name="student_status" maxLength={256} />
//         </div>

//         <div className={styles.row}>
//           <p>Years Given</p>
//           <input name="years_given" type="number" min={0} onWheel={(e) => e.currentTarget.blur()} />
//         </div>

//         <div className={styles.row}>
//           <p>Years Left</p>
//           <input name="years_left" type="number" min={0} onWheel={(e) => e.currentTarget.blur()} />
//         </div>

//         <div className={styles.row}>
//           <p>Additional Information</p>
//           <textarea name="additional_info" maxLength={512} />
//         </div>

//         <input className={styles.button} type="submit" value="Save" />
//         <button className={styles.button} onClick={() => router.push('/student')} type="button">
//           Cancel
//         </button>
//       </form>
//     </div>
//   );
// }
