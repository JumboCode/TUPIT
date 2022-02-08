import { NextPage } from 'next';
import styles from './index.module.scss';

const UploadPage: NextPage = () => {
  return (
    <div className={styles.window}>
      <div className={styles.upload}></div>
    </div>
  );
};

export default UploadPage;
