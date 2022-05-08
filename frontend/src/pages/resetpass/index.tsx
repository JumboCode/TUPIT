import React from 'react';
import { useForm } from 'react-hook-form';
import AuthBox from '@/components/authbox';
import styles from './index.module.scss';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (
    <AuthBox>
      <h3>Reset Password</h3>
      <form className={styles.form}>
        <input type="text" placeholder="Enter your email" {...register('email', {
          required: {
            value: true,
            message: 'Email must not be empty',
          },
        })}/>
        {errors.email && <p>{errors.email.message}</p>}
        <div className={styles.resetPasswordContainer}>
          <h3>An email will be sent to you with a link to reset your password.</h3>
          <button type="submit">Next</button>
        </div>
      </form>
    </AuthBox>
  );
};

export default ResetPassword;