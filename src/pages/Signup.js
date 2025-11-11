import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const renderErrors = (field) =>
    errors[field]?.map((msg, i) => (
      <div key={i} className="text-danger small">
        {msg}
      </div>
    ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await api.post("/register/", formData);
      // On success, go to login
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        console.log("REGISTER ERROR:", err.response.data);
        setErrors(err.response.data);
      } else {
        setErrors({
          non_field_errors: ["An error occurred. Please try again."],
        });
      }
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg border-0 mx-auto"
        style={{ maxWidth: "600px" }}
      >
        <div className="card-header bg-dark text-white text-center">
          <h2 className="mb-0">Create Your Profile</h2>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input
                name="username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {renderErrors("username")}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
              {renderErrors("email")}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                name="password1"
                type="password"
                className="form-control"
                value={formData.password1}
                onChange={handleChange}
                required
              />
              {renderErrors("password1")}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                name="password2"
                type="password"
                className="form-control"
                value={formData.password2}
                onChange={handleChange}
                required
              />
              {renderErrors("password2")}
            </div>

            {/* Non-field errors */}
            {renderErrors("non_field_errors")}

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success px-4">
                Sign Up
              </button>
            </div>
          </form>

          <p className="text-center mt-3 mb-0">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Login here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
