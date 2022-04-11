import React from 'react';
import AuthBox from '@/components/authbox';

const ExportResetPassword = () => {
  const callback = (e) => {
    e.preventDefault();
    console.log('HI');
  };

  const content = [
    <label htmlFor="email">
      <input id="email" type="text" name="email" placeholder="Enter your email" />
    </label>,
    <label htmlFor="password">
      <input id="password" type="text" name="password" placeholder="Enter your password" />
    </label>,
  ];

  return (
    <AuthBox header={'Reset Password'} content={content} callback={callback} navigate={'Next'} />
  );
};

export default ExportResetPassword;
