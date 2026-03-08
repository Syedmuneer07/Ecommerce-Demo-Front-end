import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Category.css';

function Category() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/category/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories(response.data.categories || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdminAndFetchCategories = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to access this page');
        setLoading(false);
        return;
      }

      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        if (!decoded.isAdmin) {
          setError('Access denied. Admin privileges required.');
          setLoading(false);
          return;
        }

        fetchCategories();
      } catch (err) {
        setError('Invalid token. Please login again.');
        setLoading(false);
        console.error('Error decoding token:', err);
      }
    };

    checkAdminAndFetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/api/category/create',
        { title: categoryName, description: categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Category created successfully!');
      setCategoryName('');
      setCategoryDescription('');
      fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      alert('Failed to create category');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Category deleted successfully!');
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category');
    }
  };

  const handleUpdate = async (categoryId) => {
    if (!editName || !editName.trim()) {
      alert('Please enter a category name');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/category/${categoryId}`,
        { title: editName, description: editDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Category updated successfully!');
      setEditingCategory(null);
      setEditName('');
      setEditDescription('');
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update category');
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category._id);
    setEditName(category.name);
    setEditDescription(category.description || '');
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditName('');
    setEditDescription('');
  };

  if (loading) {
    return (
      <div className="category-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-container">
      <h1>Category Management</h1>
      
      <div className="category-content">
        {/* Add Category Form */}
        <div className="category-form-card">
          <h2>Add New Category</h2>
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-group">
              <label htmlFor="categoryName">Category Name</label>
              <input
                type="text"
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryDescription">Description</label>
              <textarea
                id="categoryDescription"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Enter category description"
                className="form-input form-textarea"
                rows="3"
              />
            </div>
            <button type="submit" className="btn-submit">
              Create Category
            </button>
          </form>
        </div>

        {/* Categories Table */}
        <div className="categories-table-card">
          <h2>Existing Categories</h2>
          {categories.length === 0 ? (
            <p className="no-categories">No categories found. Add your first category!</p>
          ) : (
            <div className="table-responsive">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      {editingCategory === category._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              value={editName}
                              
                              onChange={(e) => setEditName(e.target.value)}
                              className="form-input edit-input"
                            />
                          </td>
                          <td>
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="form-input edit-textarea"
                              rows="2"
                            />
                          </td>
                          <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-update"
                                onClick={() => handleUpdate(category._id)}
                              >
                                Save
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={cancelEditing}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="category-name-cell">{category.title}</td>
                          <td className="category-desc-cell">
                            {category.description || 'No description'}
                          </td>
                          <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-edit"
                                onClick={() => startEditing(category)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(category._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;

