import React, { useEffect, useState, createRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/auth';
import styles from './index.module.scss';

const ENDPOINT = 'http://127.0.0.1:8000/api/course/';

const getClasses = async (url) => {
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
};

const SearchClass = () => {
  const { isLoggedIn, csrfToken, login, logout } = useAuth();
  const [subject, setSubject] = useState([]);
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [depOpts, setDepOpts] = useState([]);

  const { courseTitleInit } = router.query;
  const courseTitleInitVal = Array.isArray(courseTitleInit) ? courseTitleInit[0] : courseTitleInit;

  /*
   * Fetch all available courses in the database.
   */
  useEffect(() => {
    (async function () {
      const query = courseTitleInitVal ? `${ENDPOINT}?course_title__icontains=${courseTitleInitVal}` : ENDPOINT;
      const res = await getClasses(query);
      if (res && res.ok) {
        const data = await res.json();
        const set = new Set();
        data.data.forEach((entry) => {
          const department = entry.attributes.department;
          if (department) {
            set.add(department);
          }
        });
        setSubject(Array.from(set));
        /* TODO - Fix expected */
        // setValue('')
      }
    })();
  }, [courseTitleInitVal]);

  /*
   * @todo Handle data submission
   */
  const onSubmitSuccess = (data) => {};

  /*
   * @todo What does institution mean in terms of our backend
   */
  return (
    <div className={styles.container}>
      <div className={styles.searchClassHeader}>
        <h3>Search Class</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmitSuccess)}>
        <div className={styles.filterContainer}>
          <label htmlFor="institution">Institution:</label>
          <select id="institution" {...register('institution')}>
            <option value="" selected></option>
            <option value="Tufts">Tufts</option>
            <option value="BHCC">BHCC</option>
          </select>
        </div>
        <div className={styles.precautionText}>
          <p>We recommend you select at least one of the following:</p>
        </div>
        <div className={styles.filterContainer}>
          <label>Subject:</label>
          <input type="text" />
          <label>Attributes:</label>
          <input type="text" />
          <label>Keywords:</label>
          <input type="text" />
          <label>Instructor:</label>
          <input type="text" />
        </div>
        <div className={styles.filterContainer}>
          <div className={styles.buttonContainer}>
            <input className={styles.button} type="submit" value="Search" />
            <input className={styles.button} type="reset" value="Reset" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchClass;

// export default function SearchClass() {
//   const { isLoggedIn, csrfToken, login, logout } = useAuth();
//   const router = useRouter();
//   const [results, setResults] = useState([]);
//   const [depOpts, setDepOpts] = useState([]);

//   const courseTitle = createRef<HTMLInputElement>();
//   const tuftsCourseNum = createRef<HTMLInputElement>();
//   const bunkerCourseNum = createRef<HTMLInputElement>();
//   const department = createRef<HTMLSelectElement>();

//   useEffect(() => {
//     async function getClasses() {
//       const res = await fetch('http://127.0.0.1:8000/api/course/', {
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

//     async function getDepartmentData() {
//       fetch('http://127.0.0.1:8000/api/course/', {
//         method: 'OPTIONS',
//         headers: {
//           'Content-Type': 'application/vnd.api+json',
//           'X-CSRFToken': csrfToken,
//         },
//         credentials: 'include',
//       })
//         .then((res) => res.json())
//         .then((res) => {
//           let deps = [];
//           res.data.actions.POST.department.choices.map((dep) =>
//             deps.push({ name: dep.display_name, value: dep.value })
//           );
//           setDepOpts(deps);
//         });
//     }

//     getClasses();
//     getDepartmentData();
//   }, []);

//   async function onSearch(e) {
//     e.preventDefault();

//     const query = `?course_title__icontains=${courseTitle.current.value}&course_number_tufts__icontains=${tuftsCourseNum.current.value}&course_number_bhcc__icontains=${bunkerCourseNum.current.value}&department=${department.current.value}`;

//     const res = await fetch(`http://127.0.0.1:8000/api/course/${query}`, {
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

//   function classResult(course) {
//     return (
//       <div className={styles.result} onClick={() => router.push(`class/${course.id}`)}>
//         <div className={styles.courseTitle}>{`${course.attributes.course_title}`}</div>
//         <div className={styles.courseInfo}>
//           <span>Tufts: {`${course.attributes.course_number_tufts}`}</span>
//           <span>BHCC: {`${course.attributes.course_number_bhcc}`}</span>
//           <span>Department: {`${course.attributes.department}`}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.windowContainer}>
//       <div className={styles.window}>
//         <form onSubmit={onSearch} className={styles.filterContainer}>
//           <div className={styles.filterFields}>
//             <div className={styles.label}>Course Title</div>
//             <input type="text" ref={courseTitle} />
//             <div className={styles.label}>Tufts Course Number</div>
//             <input type="text" ref={tuftsCourseNum} />
//             <div className={styles.label}>Bunker Course Number</div>
//             <input type="text" ref={bunkerCourseNum} />
//             <div className={styles.label}>Department</div>
//             <select name="department" className={styles.select} ref={department}>
//               <option></option>
//               {depOpts.map((dep) => (
//                 <option key={dep.value} value={dep.value}>
//                   {dep.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <input className={styles.button} type="submit" value="Search" />
//         </form>
//         <div className={styles.resultsContainer}>
//           <div className={styles.results}>
//             {results &&
//               (results.length > 0 ? (
//                 results.map(classResult)
//               ) : (
//                 <div className={styles.noResults}>No results found</div>
//               ))}
//           </div>
//           <div className={styles.button} onClick={() => router.push('/class/add')}>
//             +
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
