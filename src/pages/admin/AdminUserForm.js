import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function AdminUserForm() {
  const { id } = useParams(); // user id if editing
  const isEdit = !!id;
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    is_staff: false,
    phone: "",
    password: "", // optional when editing
  });

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await api.get("/me/");
        if (!meRes.data.is_staff) {
          setError("Access denied. Admins only.");
          setLoading(false);
          return;
        }
        setIsAdmin(true);

        if (isEdit) {
          const res = await api.get(`/users/${id}/`);
          setFormData({
            username: res.data.username || "",
            email: res.data.email || "",
            is_staff: !!res.data.is_staff,
            phone: res.data.phone || "",
            password: "",
          });
        }
      } catch (err) {
        setError("Unable to load user details.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (isEdit) {
        // If password is blank, omit it so it won't change
        const payload = { ...formData };
        if (!payload.password) delete payload.password;
        await api.put(`/users/${id}/`, payload);
      } else {
        await api.post("/users/", formData);
      }
      navigate("/admin/users");
    } catch (err) {
      console.log("ADMIN USER SAVE ERROR:", err.response?.data || err);
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Failed to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>{isEdit ? "Edit User" : "Add User"}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <h2>{isEdit ? "Edit User" : "Add User"}</h2>
        <p className="text-danger">{error || "Access denied."}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>{isEdit ? "Edit User" : "Add User"}</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={isEdit} // keep username immutable
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="is_staff"
            name="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
          />
          <label className="form-check-label" htmlFor="is_staff">
            Staff (admin privileges)
          </label>
        </div>

        <div className="mb-3">
          <label className="form-label">
            {isEdit ? "New Password (leave blank to keep current)" : "Password"}
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            {...(isEdit ? {} : { required: true })}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone (Profile)</label>
          <input
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <button type="submit" className="btn btn-success" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create User"}
        </button>
      </form>
    </div>
  );
}
