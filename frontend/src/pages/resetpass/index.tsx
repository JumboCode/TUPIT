import React from 'react';
import { useForm } from 'react-hook-form';
import AuthBox from '@/components/authbox';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors }} = useForm();

  return (
    <AuthBox>
      <h3>Reset Password</h3>
      <form>
        <input type='text' placeholder='Enter your email'
         {...register('email', {
           required: {
             value: true,
             message: 'Email must not be empty'
           }
         })}/>
         {errors.email && <p>{errors.email.message}</p>}
         <button type='submit'>Next</button>
      </form>
    </AuthBox>
  );
};

export default ResetPassword;
// const ExportResetPassword = () => {
//   const callback = (e) => {
//     e.preventDefault();
//     console.log("HI");
//   };

//   const content = [
//     (<label htmlFor='email'>
//       <input id='email' type='text' name='email' placeholder='Enter your email'/>
//      </label>),
//     (<label htmlFor='password'>
//       <input id='password' type='text' name='password' placeholder='Enter your password'/>
//     </label>) 
//   ];

//   return (
//     <AuthBox header={'Reset Password'}
//      content={content}
//      callback={callback}
//      navigate={'Next'} />
//   );
// };

// export default ExportResetPassword;
