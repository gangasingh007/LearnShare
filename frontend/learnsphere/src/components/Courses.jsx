import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

function Courses({ token, user }) {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('');
  const [newCourseLink, setNewCourseLink] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState('');
  const [newCourseImageUrl, setNewCourseImageUrl] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [editCourseTitle, setEditCourseTitle] = useState('');
  const [editCourseDescription, setEditCourseDescription] = useState('');
  const [editCourseCategory, setEditCourseCategory] = useState('');
  const [editCourseLink, setEditCourseLink] = useState('');
  const [editCoursePrice, setEditCoursePrice] = useState('');
  const [editCourseImageUrl, setEditCourseImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchCourses = async () => {
    setIsLoading(true);
    setError('');
    let url = 'http://localhost:5000/api/courses/displayall';
    const params = new URLSearchParams();
    if (filterCategory) params.append('category', filterCategory);
    if (searchTerm) params.append('search', searchTerm);
    if (params.toString()) url += `?${params.toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        setCourses(data.courses || []);
      } else {
        setError(data.message || 'Failed to fetch courses.');
      }
    } catch (err) {
      setError('Server error while fetching courses.');
      console.error('Fetch courses error:', err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, [filterCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const resetAddForm = () => {
    setNewCourseTitle('');
    setNewCourseDescription('');
    setNewCourseCategory('');
    setNewCourseLink('');
    setNewCoursePrice('');
    setNewCourseImageUrl('');
    setShowAddForm(false);
  };

  const resetEditForm = () => {
    setEditingCourse(null);
    setEditCourseTitle('');
    setEditCourseDescription('');
    setEditCourseCategory('');
    setEditCourseLink('');
    setEditCoursePrice('');
    setEditCourseImageUrl('');
    setShowEditForm(false);
  };

  const handleShowAddCourseForm = () => {
    resetAddForm();
    setShowAddForm(true);
    setShowEditForm(false);
  };

  const handleShowEditCourseForm = (course) => {
    resetEditForm();
    setEditingCourse(course);
    setEditCourseTitle(course.title);
    setEditCourseDescription(course.description || '');
    setEditCourseCategory(course.category || '');
    setEditCourseLink(course.link);
    setEditCoursePrice(course.price !== undefined ? String(course.price) : '');
    setEditCourseImageUrl(course.imageUrl || '');
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        fetchCourses();
        alert('Course deleted successfully');
      } else {
        setError(data.message || 'Failed to delete course.');
        alert(`Error: ${data.message || 'Failed to delete course.'}`);
      }
    } catch (err) {
      setError('Server error while deleting course.');
      alert('Server error while deleting course.');
      console.error('Delete course error:', err);
    }
  };

  const handleAddCourseSubmit = async (e) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseLink) {
      setError('Title and Link are required for a new course.');
      return;
    }
    setError('');

    const courseData = {
      title: newCourseTitle,
      description: newCourseDescription,
      category: newCourseCategory,
      link: newCourseLink,
      price: newCoursePrice ? parseFloat(newCoursePrice) : undefined,
      imageUrl: newCourseImageUrl,
    };

    try {
      const response = await fetch('http://localhost:5000/api/courses/addcourse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchCourses();
        resetAddForm();
        alert('Course added successfully!');
      } else {
        setError(data.message || 'Failed to add course.');
        alert(`Error: ${data.message || 'Failed to add course.'}`);
      }
    } catch (err) {
      setError('Server error while adding course.');
      alert('Server error while adding course.');
      console.error('Add course submit error:', err);
    }
  };

  const handleEditCourseSubmit = async (e) => {
    e.preventDefault();
    if (!editingCourse || !editCourseTitle || !editCourseLink) {
      setError('Title and Link are required to edit a course.');
      return;
    }
    setError('');

    const courseData = {
      title: editCourseTitle,
      description: editCourseDescription,
      category: editCourseCategory,
      link: editCourseLink,
      price: editCoursePrice ? parseFloat(editCoursePrice) : undefined,
      imageUrl: editCourseImageUrl,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${editingCourse._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });
      const data = await response.json();
      if (response.ok) {
        fetchCourses();
        resetEditForm();
        alert('Course updated successfully!');
      } else {
        setError(data.message || 'Failed to update course.');
        alert(`Error: ${data.message || 'Failed to update course.'}`);
      }
    } catch (err) {
      setError('Server error while updating course.');
      alert('Server error while updating course.');
      console.error('Edit course submit error:', err);
    }
  };

  const canManageCourse = (course) => {
    if (!user) return false;
    return user.role === 'admin' || (course.createdBy && course.createdBy._id === user.id);
  };

  return (
    <div className="courses-page fade-in">
      <div className="courses-header">
        <h1>📚 Available Courses</h1>
        {user && (user.role === 'admin' || user.role === 'contributor') && (
          <button onClick={handleShowAddCourseForm} className="add-course-btn">
            ➕ Add New Course
          </button>
        )}
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Filter by category..." 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)} 
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Search</button>
          <button type="button" onClick={() => { setSearchTerm(''); setFilterCategory(''); fetchCourses(); }} className="cancel-btn">Clear</button>
        </div>
      </form>

      {showAddForm && (
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>Add New Course 📚</h2>
            </div>
            <form onSubmit={handleAddCourseSubmit} className="course-form">
              <div className="form-group">
                <label>Title:</label>
                <input type="text" value={newCourseTitle} onChange={(e) => setNewCourseTitle(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea value={newCourseDescription} onChange={(e) => setNewCourseDescription(e.target.value)} className="form-textarea" />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input type="text" value={newCourseCategory} onChange={(e) => setNewCourseCategory(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Link:</label>
                <input type="url" value={newCourseLink} onChange={(e) => setNewCourseLink(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input type="number" value={newCoursePrice} onChange={(e) => setNewCoursePrice(e.target.value)} placeholder="0.00" className="form-input" />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input type="url" value={newCourseImageUrl} onChange={(e) => setNewCourseImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="form-input" />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Save Course</button>
                <button type="button" onClick={resetAddForm} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditForm && editingCourse && (
        <div className="form-container">
          <div className="form-card">
            <div className="form-header">
              <h2>Edit Course 📚</h2>
            </div>
            <form onSubmit={handleEditCourseSubmit} className="course-form">
              <div className="form-group">
                <label>Title:</label>
                <input type="text" value={editCourseTitle} onChange={(e) => setEditCourseTitle(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea value={editCourseDescription} onChange={(e) => setEditCourseDescription(e.target.value)} className="form-textarea" />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input type="text" value={editCourseCategory} onChange={(e) => setEditCourseCategory(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label>Link:</label>
                <input type="url" value={editCourseLink} onChange={(e) => setEditCourseLink(e.target.value)} required className="form-input" />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input type="number" value={editCoursePrice} onChange={(e) => setEditCoursePrice(e.target.value)} placeholder="0.00" className="form-input" />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input type="url" value={editCourseImageUrl} onChange={(e) => setEditCourseImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="form-input" />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">Update Course</button>
                <button type="button" onClick={resetEditForm} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner />}
      {error && <p className="error-message">{error}</p>}

      {!isLoading && !error && courses.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter, or add a new course!</p>
        </div>
      )}
      {!isLoading && !error && courses.length > 0 && (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <h3 className="course-title">{course.title}</h3>
                {course.category && <span className="course-category">{course.category}</span>}
              </div>
              {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="course-image" />}
              <p className="course-description">{course.description || 'No description available.'}</p>
              <div className="course-meta">
                <div className="course-author">
                  <span className="author-icon">
                    {course.createdBy?.role === 'admin' ? '👑' : course.createdBy?.role === 'contributor' ? '✍️' : '👤'}
                  </span>
                  <span>{course.createdBy ? course.createdBy.name : 'Unknown'} ({course.createdBy ? course.createdBy.role : 'N/A'})</span>
                </div>
                <p className="course-date">Created: {new Date(course.createdAt).toLocaleDateString()}</p>
              </div>
              {course.price !== undefined && <p className="course-price">Price: ${course.price.toFixed(2)}</p>}
              <div className="course-actions">
                <a href={course.link} target="_blank" rel="noopener noreferrer" className="course-link-btn">🔗 View Course</a>
                {token && canManageCourse(course) && (
                  <>
                    <button onClick={() => handleShowEditCourseForm(course)} className="edit-btn">✏️ Edit</button>
                    <button onClick={() => handleDeleteCourse(course._id)} className="delete-btn">🗑️ Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;