import router from 'next/router';
import { useAuth } from '../auth';
import { useS3Upload } from 'next-s3-upload';
import styles from './FileViewer.module.scss';
import { useState } from 'react';

const FileViewer = (studentData) => {
  const [file, setFile] = useState(null);
  const { csrfToken } = useAuth();
  const { uploadToS3 } = useS3Upload();

  let associated_files =
    studentData.attributes == undefined ? null : studentData.attributes.associated_files;

  const handleFileChange = async (event) => {
    let currFile = event.target.files[0];
    setFile(currFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let backendUrl = `http://127.0.0.1:8000/api/students/${studentData.id}/`;
    // let { url } = await uploadToS3(file);
    let url = file.name;

    associated_files.push(url);
    console.log(associated_files);
    studentData.attributes.associated_files = associated_files;

    const res = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        data: studentData,
      }),
    }).catch((err) => {
      alert('Error connecting to server');
      console.log(err);
    });

    console.log(res);

    if (res)
      if (res.ok) {
        alert(`Successfully uploading ${file.name}`);
        router.replace(`/student/${studentData.id}`);
      } else {
        alert(`Failed to upload ${file.name}`);
        // res.json().then((data) => console.log(data));
        res.json().then((data) => console.log(data));
      }
  };

  return (
    <>
      <div>{associated_files}</div>
      <form className={styles.dropContainer} onSubmit={handleSubmit}>
        <h1>Choose a file to upload</h1>
        <input className={styles.upload} type="file" title="" onChange={handleFileChange} />
        <div className={styles.submitContainer}>
          <input className={styles.submit} type="submit" value="Submit" />
        </div>
      </form>
    </>
  );
};

export default FileViewer;
