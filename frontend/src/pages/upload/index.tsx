import { NextPage } from 'next';
import { useS3Upload } from 'next-s3-upload';
import { useState } from 'react';
import { useAuth } from '../../components/auth';
import styles from './index.module.scss';

const backendUrl = 'http://127.0.0.1:8000/api/students/';

const UploadPage: NextPage = () => {
  const [currFile, setFile] = useState(null);
  const { uploadToS3 } = useS3Upload();
  const { csrfToken } = useAuth();

  const handleFileChange = async (event) => {
    let file = event.target.files[0];
    setFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let { url } = await uploadToS3(currFile);
    const t = event.target;
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: {
          type: 'Student',
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
          },
        },
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.dropContainer}>
        <h1>Drag and drop to the box below or choose a file</h1>
        <input className={styles.upload} type="file" title="" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default UploadPage;
