import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '../../components/auth';
import styles from './index.module.scss';

const ENDPOINT: string = `http://127.0.0.1:8000/api/students/`;

/*
 * Get data on query.
 */
const getData = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }).catch((err) => {
    alert('Error connecting to server');
    console.log(err);
  });
  
  return res;
}

const SearchStudents = () => {
  const router = useRouter();
  const [results, setResults] = useState([]); /* Query results */
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    (async function() {
      const res = await getData(`${ENDPOINT}?ordering=lastname`);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  }, []);

  const onSubmitSuccess = (data) => {
    (async function() {
      const query = `?firstname__icontains=${data.firstName}` + 
                    `&lastname__icontains=${data.lastName}` +
                    `&tufts_num=${data.tuftsNum}` + 
                    `&bhcc_num=${data.bhccNum}` + 
                    `&cohort=${data.cohort}` +
                    `&doc_num=${data.docNum}` +
                    `&ordering=lastname`;
      const res = await getData(`${ENDPOINT}${query}`);
      if (res && res.ok) {
        const data = await res.json();
        setResults(data.data);
      }
    })();
  };

  return (
    <div className={styles.windowContainer}>
      <div className={styles.studentProgressHeader}>
        <h3>Student Progress</h3>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <form onSubmit={handleSubmit(onSubmitSuccess)}>
            <div className={styles.filterContainer}>
              <label htmlFor='firstName'>First Name:</label>
              <input id='firstName' type='text' {...register('firstName')}/>
              <label htmlFor='lastName'>Last Name:</label>
              <input id='lastName' type='text' {...register('lastName')}/>
              <label htmlFor='tuftsNum'>Tufts Number:</label>
              <input id='tuftsNum' type='text' {...register('tuftsNum')}/>
              <label htmlFor='bhccNum'>BHCC Number:</label>
              <input id='bhccNum' type='text' {...register('bhccNum')}/>
              <label htmlFor='docNum'>DOC Number:</label>
              <input id='docNum' type='text' {...register('docNum')}/>
              <label htmlFor='cohort'>Cohort:</label>
              <input id='cohort' type='text' {...register('cohort')}/>
              <div></div>
              <div className={styles.button}>
                <input type='submit' value='Submit'/>
                <input type='reset' value='Reset'/>
              </div>
            </div>
          </form>
        </div>
        <div className={styles.column}>
          <div className={styles.resultsWrapper}>
            {results && results.length > 0 ? 
              (<div className={styles.resultsContainer}>
                <div className={styles.searchResultsHeader}>Search Result:</div>
                <div></div>
                {results.map((student) => {
                  const key = `${student.attributes.firstname} ${student.attributes.lastname}`
                  return (
                    <React.Fragment key={key}>
                      <div className={styles.resultsField}>
                        <span>{key}</span>
                      </div>
                      <div className={styles.resultsView}>
                        <button onClick={() => router.push(`student/${student.id}`)}>View</button>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>) : (
              <div className={styles.noResults}>
                No results found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchStudents;
// export default function SearchStudents() {
//   const { isLoggedIn, csrfToken, login, logout } = useAuth();
//   const router = useRouter();
//   const [results, setResults] = useState([]);

//   const firstname = createRef<HTMLInputElement>();
//   const lastname = createRef<HTMLInputElement>();
//   const docNum = createRef<HTMLInputElement>();
//   const tuftsNum = createRef<HTMLInputElement>();
//   const bhccNum = createRef<HTMLInputElement>();
//   const cohort = createRef<HTMLInputElement>();

//   useEffect(() => {
//     async function getStudents() {
//       const res = await fetch('http://127.0.0.1:8000/api/students/?ordering=lastname', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//       }).catch((err) => {
//         alert('Error connecting to server');
//         console.log(err);
//       });
//       if (res && res.ok) {
//         const data = await res.json();
//         setResults(data.data);
//       }
//     }
//     getStudents();
//   }, []);

//   async function onReset(e) {
//     console.log('resetting');
//     const res = await fetch(`http://127.0.0.1:8000/api/students`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     }).catch((err) => {
//       alert('Error connecting to server');
//       console.log(err);
//     });
//     if (res && res.ok) {
//       const data = await res.json();
//       setResults(data.data);
//     }
//   }

//   async function onSearch(e) {
//     e.preventDefault();
//     const firstnameVal = firstname.current.value;
//     const lastnameVal = lastname.current.value;
//     const docNumVal = docNum.current.value;
//     const tuftsNumVal = tuftsNum.current.value;
//     const bhccNumVal = bhccNum.current.value;
//     const cohortVal = cohort.current.value;

//     const query = `?firstname__icontains=${firstnameVal}&lastname__icontains=${lastnameVal}&doc_num=${docNumVal}&tufts_num=${tuftsNumVal}&bhcc_num=${bhccNumVal}&cohort=${cohortVal}&ordering=lastname`;

//     const res = await fetch(`http://127.0.0.1:8000/api/students/${query}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include',
//     }).catch((err) => {
//       alert('Error connecting to server');
//       console.log(err);
//     });
//     if (res && res.ok) {
//       const data = await res.json();
//       setResults(data.data);
//     }
//   }

//   function studentResult(student) {
//     return (
//       <div className={styles.result} onClick={() => router.push(`student/${student.id}`)}>
//         <div className={styles.studentInfo}>
//           <span
//             className={styles.studentName}
//           >{`${student.attributes.firstname} ${student.attributes.lastname}`}</span>
//           <span>{student.attributes.cohort}</span>
//           <span>{student.attributes.doc_num}</span>
//           <span>{student.attributes.tufts_num}</span>
//           <span>{student.attributes.bhcc_num}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.windowContainer}>
//       <div className={styles.studentProgress}>Student Progress</div>
//       <div className={styles.window}>
//         <div className={styles.filterAndResults}>
//           <form onSubmit={onSearch} onReset={onReset} className={styles.filterContainer}>
//             <div className={styles.filterFields}>
//               <div className={styles.label}>First Name</div>
//               <input className={styles.input} type="text" ref={firstname} />
//               <div className={styles.label}>Last Name</div>
//               <input className={styles.input} type="text" ref={lastname} />
//               <div className={styles.label}>Tufts Number</div>
//               <input className={styles.input} type="text" ref={tuftsNum} />
//               <div className={styles.label}>BHCC Number</div>
//               <input className={styles.input} type="text" ref={bhccNum} />
//               <div className={styles.label}>DOC Number</div>
//               <input className={styles.input} type="text" ref={docNum} />
//               <div className={styles.label}>Cohort</div>
//               <input
//                 className={styles.input}
//                 type="number"
//                 ref={cohort}
//                 min={0}
//                 onWheel={(e) => e.currentTarget.blur()}
//               />
//               <div></div>
//               <div className={styles.buttonDiv}>
//                 <input className={styles.button} type="submit" value="Search" />
//                 <input className={styles.button} type="reset" value="Reset" />
//               </div>
//             </div>
//           </form>
//           <div className={styles.resultsContainer}>
//             <div className={styles.results}>
//               {results &&
//                 (results.length > 0 ? (
//                   <React.Fragment>
//                     <div className={styles.searchResultsHeader}>Search Results</div>
//                     <div className={styles.columnNames}>
//                       <span>Name</span>
//                       <span>Cohort</span>
//                       <span>DOC</span>
//                       <span>Tufts</span>
//                       <span>BHCC</span>
//                     </div>
//                     {results.map(studentResult)}
//                   </React.Fragment>
//                 ) : (
//                   <div className={styles.noResults}>No results found</div>
//                 ))}
//             </div>
//           </div>
//         </div>
//         <div className={styles.button} onClick={() => router.push('/student/add')}>
//           +
//         </div>
//       </div>
//     </div>
//   );
// }
