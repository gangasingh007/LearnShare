import React, { useState } from 'react';

function Auth({ onLogin, initialIsLogin }) {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';
    const payload = isLogin ? { email, password } : { name, email, password, role };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          onLogin(data.token, data.user);
        } else {
          setMessage('Registration successful! Please login.');
          setIsLogin(true);
        }
      } else {
        setError(data.message || 'An error occurred.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="form-input"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="form-select">
                <option value="viewer">👀 Viewer</option>
                <option value="contributor">✍️ Contributor</option>
              </select>
            </div>
          )}
          <button type="submit" className="submit-btn">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <div className="auth-footer">
          <button className="toggle-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need to register?' : 'Already have an account?'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;