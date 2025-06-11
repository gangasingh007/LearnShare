import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getToken, removeToken } from '../utils/api';

const Navigation = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!getToken();

  const handleLogout = () => {
    removeToken();
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon"></span>
          LearnSphere
        </Link>
      </div>
      
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link 
              to="/courses" 
              className={`nav-link ${location.pathname === '/courses' ? 'active' : ''}`}
            >
              📚 Courses
            </Link>
            <Link 
              to="/profile" 
              className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
            >
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="nav-button logout-btn">
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
            >
              🔐 Login
            </Link>
            <Link 
              to="/register" 
              className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
            >
              📝 Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;