import router from 'next/router';
import { useAuth } from '../auth';
import styles from './FileViewer.module.scss';
import { useState } from 'react';

const getFileName = (url: string) => {
  const lastSlashLoc = url.lastIndexOf('/');

  return url.slice(lastSlashLoc + 1);
};

const getFileUrl = (name: string) => {
  return `https://tupit.s3.amazonaws.com/${name}`;
};

const FileViewer = (studentData) => {
  const [file, setFile] = useState(null);
  const { csrfToken } = useAuth();

  let associated_files =
    studentData.attributes == undefined ? [] : studentData.attributes.associated_files;

  const handleFileChange = async (event) => {
    let currFile = event.target.files[0];
    setFile(currFile);
  };

  const deleteFile = (index: number) => {
    return async (event) => {
      event.preventDefault();
      let url = associated_files[index];

      await fetch('/api/s3-upload', {
        method: 'DELETE',
        body: JSON.stringify({
          key: getFileName(url),
        }),
      }).catch((err) => {
        alert('Error deleting file.');
        console.log(err);
      });

      associated_files.splice(index, 1);
      studentData.attributes.associated_files = associated_files;

      let backendUrl = `http://127.0.0.1:8000/api/students/${studentData.id}/`;
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
        alert('Error connecting to server.');
        console.log(err);
      });

      if (res && res.ok) {
        alert('Successfully deleted the file.');
        router.replace(`/student/${studentData.id}`);
      }
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) return alert('Please select a file to upload before submitting');

    let resp = await fetch('/api/s3-upload', {
      method: 'POST',
      body: JSON.stringify({
        name: file.name,
        type: file.type,
      }),
    })
      .then((res) => res.json())
      .catch((err) => {
        alert('Error uploading file.');
        console.log(err);
      });
    if (resp == undefined) {
      return;
    }

    let { url } = resp;
    await fetch(url, {
      method: 'PUT',
      body: file,
    }).catch((err) => {
      alert('Error uploading file.');
      console.log(err);
    });

    url = getFileUrl(file.name);
    associated_files.push(url);
    studentData.attributes.associated_files = associated_files;

    let backendUrl = `http://127.0.0.1:8000/api/students/${studentData.id}/`;
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
      <form className={styles.dropContainer} onSubmit={handleSubmit}>
        <p>Choose a file to upload</p>
        <input className={styles.upload} type="file" title="" onChange={handleFileChange} />
        <div className={styles.submitContainer}>
          <button className={styles.submit} type="submit" value="Submit">
            Submit
          </button>
        </div>
      </form>
      {associated_files == undefined || associated_files.length == 0 ? null : (
        <div className={styles.fileDisplay}>
          {associated_files.map((file: string, index: number) => (
            <div>
              <a href={file} target="_blank">
                {getFileName(file)}
                <br />
              </a>
              <button value="Delete" onClick={deleteFile(index)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FileViewer;
