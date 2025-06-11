import React, { useState, useEffect } from 'react';

function Profile({ token, user, setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    } else {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
      } else {
        setError(data.message || 'Failed to fetch profile.');
      }
    } catch (err) {
      setError('Server error while fetching profile.');
      console.error('Fetch profile error:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile updated successfully!');
        setUser(data.user);
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Server error while updating profile.');
      console.error('Update profile error:', err);
    }
  };

  if (!user) {
    return <div className="loading-container"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="profile-container fade-in">
      <div className="profile-card">
        <div className="profile-header">
          <h2>User Profile</h2>
        </div>
        <form className="profile-form" onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label htmlFor="profile-name">Name:</label>
            <input
              type="text"
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="profile-email">Email:</label>
            <input
              type="email"
              id="profile-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn">Update Profile</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <div className="profile-info">
          <p><strong>Role:</strong> <span className={`role-badge role-${user.role}`}>
            {user.role === 'admin' ? '👑' : user.role === 'contributor' ? '✍️' : '👀'} {user.role}
          </span></p>
          <p><strong>Subscribed:</strong> {user.subscribed ? 'Yes' : 'No'}</p>
          {user.subscription && user.subscription.plan && (
            <p><strong>Subscription Plan:</strong> {user.subscription.plan} (Expires: {new Date(user.subscription.expiresAt).toLocaleDateString()})</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;