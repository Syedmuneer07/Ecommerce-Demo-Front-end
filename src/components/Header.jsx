import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and if admin
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    
    if (token) {
      try {
       const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decoded.isAdmin || false);
      } catch (err) {
        setIsAdmin(false);
        console.error('Error decoding token:', err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Link to="/">Online Shop</Link>
        </div>
        
        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">Shop</Link>
            </li>
            <li className="nav-item">
              <Link to="/cart" className="nav-link">Cart</Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link to="/orders" className="nav-link">My Orders</Link>
              </li>
            )}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link to="/admin" className="nav-link admin-link">Admin</Link>
                </li>
                <li className="nav-item">
                  <Link to="/category" className="nav-link">Categories</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/products" className="nav-link">Products</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div className="header-auth">
          {isLoggedIn ? (
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

