import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";


function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const address = e.target.address.value;
    const contactNumber = e.target.contactNumber.value;
    const password = e.target.password.value;

    axios
      .post(`${import.meta.env.REACT_APP_BACKEND_API_URL}/api/auth/register`, {
        name,
        email,
        address,
        contactNumber,
        password,
      })
      .then((res) => {
        console.log(res.data);
        alert("User registered successfully");
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log("There was an error", err);
        alert("There was an error, please try again");
      });
  };
  return (
    <div className="auth-page">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-5">
            <div className="auth-brand text-center mb-4">
              <h2 className="brand-name">ShopHub</h2>
              <p className="brand-tagline">Your Premium Shopping Destination</p>
            </div>

            <div className="auth-card">
              <h1 className="text-center mb-1">Create Account</h1>
              <p className="auth-subtitle text-center mb-4">
                Join us and start shopping
              </p>

              <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
                <div className="form-group mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    id="address"
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="contactNumber" className="form-label">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="contactNumber"
                    id="contactNumber"
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button type="submit" className="auth-button btn w-100 mb-3">
                  Create Account
                </button>
              </form>

              <div className="auth-footer text-center">
                <p className="mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
