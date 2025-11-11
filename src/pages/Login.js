import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/token/", {
        username: formData.username,
        password: formData.password,
      });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/rooms");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow-lg border-0 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="card-header bg-dark text-white text-center">
          <h2 className="mb-0">Login</h2>
        </div>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                name="username"
                placeholder="Username"
                className="form-control"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                Login
              </button>
            </div>
          </form>

          <p className="text-center mt-3 mb-0">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-decoration-none fw-semibold">
              Sign up here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
