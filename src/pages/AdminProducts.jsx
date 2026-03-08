import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminProducts.css';

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mrpPrice, setMrpPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [inStock, setInStock] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Edit state
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editMrpPrice, setEditMrpPrice] = useState('');
  const [editDiscountedPrice, setEditDiscountedPrice] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editInStock, setEditInStock] = useState(true);
  const [editImages, setEditImages] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/category/list', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Upload single image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your-upload-preset';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    const res = await axios.post(url, formData);
    return res.data.secure_url || res.data.url;
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(files);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    }
  };

  // Remove selected image
  const removeSelectedImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreview(newPreviews);
  };

  useEffect(() => {
    const checkAdminAndFetchData = async () => {
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

        await Promise.all([fetchProducts(), fetchCategories()]);
        setLoading(false);
      } catch (err) {
        setError('Invalid token. Please login again.');
        setLoading(false);
        console.error('Error decoding token:', err);
      }
    };

    checkAdminAndFetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !mrpPrice || !discountedPrice || !categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      let imageUrls = [];
      
      // Upload images to Cloudinary if files are selected (parallel upload)
      if (Array.isArray(selectedImages) && selectedImages.length > 0) {
        imageUrls = await Promise.all(selectedImages.map(f => uploadToCloudinary(f)));
      } else if (typeof existingImages === 'string' && existingImages.trim()) {
        // Fallback to text input if no files selected
        imageUrls = existingImages.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      await axios.post(
        'http://localhost:3000/api/products/create',
        {
          title: title.trim(),
          description: description.trim(),
          mrpPrice: parseFloat(mrpPrice),
          discountedPrice: parseFloat(discountedPrice),
          categoryId,
          inStock,
          images: imageUrls,
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      alert('Product created successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setMrpPrice('');
      setDiscountedPrice('');
      setCategoryId('');
      setInStock(true);
      setSelectedImages([]);
      setImagePreview([]);
      setExistingImages('');
      setIsActive(true);
      
      fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      alert(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setEditTitle(product.title);
    setEditDescription(product.description);
    setEditMrpPrice(product.mrpPrice);
    setEditDiscountedPrice(product.discountedPrice);
    setEditCategoryId(product.categoryId);
    setEditInStock(product.inStock);
    setEditImages(product.images ? product.images.join(', ') : '');
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditTitle('');
    setEditDescription('');
    setEditMrpPrice('');
    setEditDiscountedPrice('');
    setEditCategoryId('');
    setEditInStock(true);
    setEditImages('');
  };

  const handleUpdate = async (productId) => {
    if (!editTitle.trim() || !editDescription.trim() || !editMrpPrice || !editDiscountedPrice || !editCategoryId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const imageArray = editImages.trim() ? editImages.split(',').map(img => img.trim()) : [];
      
      await axios.put(
        `http://localhost:3000/api/products/${productId}`,
        {
          title: editTitle,
          description: editDescription,
          mrpPrice: parseFloat(editMrpPrice),
          discountedPrice: parseFloat(editDiscountedPrice),
          categoryId: editCategoryId,
          inStock: editInStock,
          images: imageArray,
          isActive: true,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      alert('Product updated successfully!');
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      alert(err.response?.data?.message || 'Failed to update product');
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    return category ? category.title : 'Unknown';
  };

  if (loading) {
    return (
      <div className="admin-products-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-products-container">
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products-container">
      <h1>Product Management</h1>
      
      <div className="products-content">
        {/* Add Product Form */}
        <div className="product-form-card">
          <h2>Add New Product</h2>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter product title"
                className="form-input"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                className="form-input form-textarea"
                rows="3"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mrpPrice">MRP Price (₹) *</label>
                <input
                  type="number"
                  id="mrpPrice"
                  value={mrpPrice}
                  onChange={(e) => setMrpPrice(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="discountedPrice">Discounted Price (₹) *</label>
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="images">Product Images</label>
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="form-input file-input"
              />
              {imagePreview.length > 0 && (
                <div className="image-preview-container">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removeSelectedImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                id="existingImages"
                value={existingImages}
                onChange={(e) => setExistingImages(e.target.value)}
                placeholder="Or enter image URLs (comma separated)"
                className="form-input"
              />
            </div>
            
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="inStock"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
              />
              <label htmlFor="inStock">In Stock</label>
            </div>
            
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>

        {/* Products Table */}
        <div className="products-table-card">
          <h2>Existing Products</h2>
          {products.length === 0 ? (
            <p className="no-products">No products found. Add your first product!</p>
          ) : (
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      {editingProduct === product._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
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
                          <td>
                            <input
                              type="number"
                              value={editMrpPrice}
                              onChange={(e) => setEditMrpPrice(e.target.value)}
                              className="form-input edit-input"
                              style={{ width: '60px', marginRight: '4px' }}
                              min="0"
                              step="0.01"
                            />
                            <input
                              type="number"
                              value={editDiscountedPrice}
                              onChange={(e) => setEditDiscountedPrice(e.target.value)}
                              className="form-input edit-input"
                              style={{ width: '60px' }}
                              min="0"
                              step="0.01"
                            />
                          </td>
                          <td>
                            <select
                              value={editCategoryId}
                              onChange={(e) => setEditCategoryId(e.target.value)}
                              className="form-input edit-input"
                            >
                              {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.title}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={editInStock}
                              onChange={(e) => setEditInStock(e.target.checked)}
                            />
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-update"
                                onClick={() => handleUpdate(product._id)}
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
                          <td className="product-title-cell">{product.title}</td>
                          <td className="product-desc-cell">
                            {product.description || 'No description'}
                          </td>
                          <td className="product-price-cell">
                            <span className="discounted-price">₹{product.discountedPrice}</span>
                            <span className="mrp-price">₹{product.mrpPrice}</span>
                          </td>
                          <td>{getCategoryName(product.categoryId)}</td>
                          <td>
                            <span className={`instock-badge ${product.inStock ? 'yes' : 'no'}`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-edit"
                                onClick={() => startEditing(product)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(product._id)}
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

export default AdminProducts;

