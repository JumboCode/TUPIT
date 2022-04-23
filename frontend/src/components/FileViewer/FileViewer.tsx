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

    if (!file) return alert('Please select a file to upload before submitting');

    let backendUrl = `http://127.0.0.1:8000/api/students/${studentData.id}/`;
    let url = await fetch(`/api/s3`)
      .then((response) => response.json())
      .then((response) => response.payload)
      .catch((err) => console.log(err));
    //let url = file.name;
    console.log(url);

    associated_files.push(url);
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

    if (res)
      if (res.ok) {
        alert(`Successfully uploading ${file.name}`);
        router.replace(`/student/${studentData.id}`);
      } else {
        alert(`Failed to upload ${file.name}`);
        try {
          res.json().then((data) => console.log(data));
        } catch {
          res.text().then((data) => console.log(data));
        }
      }
  };

  return (
    <>
      <p>Choose a file to upload</p>
      <form className={styles.dropContainer} onSubmit={handleSubmit}>
        <input className={styles.upload} type="file" title="" onChange={handleFileChange} />
        <div className={styles.submitContainer}>
          <button className={styles.submit} type="submit" value="Submit">
            Submit
          </button>
        </div>
      </form>
      {associated_files == undefined || associated_files.length == 0 ? null : (
        <div className={styles.fileDisplay}>
          {associated_files.map((file) => (
            <p>{file}</p>
          ))}
        </div>
      )}
    </>
  );
};

export default FileViewer;
