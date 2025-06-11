import React from 'react';
import Auth from './Auth';

const Login = ({ onLogin }) => {
  return <Auth onLogin={onLogin} initialIsLogin={true} />;
};

export default Login;