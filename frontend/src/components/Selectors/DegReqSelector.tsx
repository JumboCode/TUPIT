import React, { useEffect, useState } from 'react';
import styles from './Selectors.module.scss';

type DegReqSelectorProps = {
  show: boolean;
  writeFunction: (course: { title: string; id: number }) => void;
  onClose: () => void;
};

export const ReqSelector: React.FC<DegReqSelectorProps> = (props) => {
  const [master, setMaster] = useState([]);
  const [filteredReqs, setFilteredReqs] = useState(null);

  useEffect(() => {
    async function getReqs() {
      const url = 'http://127.0.0.1:8000/api/degreerequirement/';
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
        const data = await res.json();
        let courses = data.data.map((i) => {
          return {
            title: i.attributes.title,
            id: i.id,
          };
        });
        setMaster(Array.from(courses).sort());
      }
    }

    getReqs();
  }, []);

  useEffect(() => {
    setFilteredReqs(master);
  }, [props.show]);

  function query(e) {
    let query = e.target.value;
    if (query == '') {
      setFilteredReqs(master);
    } else {
      let filteredReqs = master.filter((course) =>
        course.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredReqs(filteredReqs);
    }
  }

  return props.show ? (
    <div className={styles.windowContainer}>
      <div className={styles.closeArea} onClick={props.onClose}></div>
      <div className={styles.popup}>
        <div className={styles.title}>Select Requirements</div>
        <input className={styles.searchBox} placeholder="Search by title" onChange={query} />
        <div className={styles.results}>
          {filteredReqs &&
            filteredReqs.map((req) => (
              <div
                className={styles.result}
                key={req.id}
                onClick={() => {
                  props.writeFunction(req);
                  props.onClose();
                }}
              >
                {req.title}
              </div>
            ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default ReqSelector;
