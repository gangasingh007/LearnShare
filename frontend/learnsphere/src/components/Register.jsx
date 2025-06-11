import React from 'react';
import Auth from './Auth';

const Register = ({ onLogin }) => {
  return <Auth onLogin={onLogin} initialIsLogin={false} />;
};

export default Register;