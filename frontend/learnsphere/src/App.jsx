import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Courses from './components/Courses';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || '');

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('authToken', newToken);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('authToken');
  };

  return (
   
      <Router>
        <div className="app">
          <Navigation onLogout={handleLogout} user={user} />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/register" element={<Register onLogin={handleLogin} />} />
              <Route path="/courses" element={
                <ProtectedRoute>
                  <Courses token={token} user={user} />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile token={token} user={user} setUser={setUser} />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/courses" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
 
  );
};

export default App;