import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";
import GoogleLoginButton from "../components/GoogleLoginButton";

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    axios
      .post(`${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}/api/auth/login`, {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        alert("User logged in successfully");
        localStorage.setItem("token", res.data.token);
        const userData = res.data.token.split(".")[1];

        const decodedUserData = JSON.parse(atob(userData));
        localStorage.setItem("user", JSON.stringify(decodedUserData));

        if (res.data.user.isAdmin) {
          localStorage.setItem("isAdmin", true);
          window.location.href = "/admin";
        } else {
          localStorage.removeItem("isAdmin");
          window.location.href = "/";
        }
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
              <h1 className="text-center mb-1">Welcome Back</h1>
              <p className="auth-subtitle text-center mb-4">
                Sign in to continue shopping
              </p>

              <form className="login-form" onSubmit={(e) => handleSubmit(e)}>
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

                <div className="form-options row mb-3">
                  <div className="col-6">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                      />
                      <label className="form-check-label" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <a href="#" className="forgot-password">
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <button type="submit" className="auth-button btn w-100 mb-3">
                  Sign In
                </button>
              </form>
              <GoogleLoginButton/>

              <div className="auth-footer text-center">
                <p className="mb-0">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-decoration-none">
                    Create Account
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

export default Login;
