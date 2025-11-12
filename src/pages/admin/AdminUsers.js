import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function AdminUsers() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
        await refresh();
      } catch (err) {
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const refresh = async () => {
    const res = await api.get("/users/");
    setUsers(res.data);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user account?")) return;
    try {
      await api.delete(`/users/${userId}/`);
      await refresh();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Failed to delete user (cannot delete superuser or yourself)."
      );
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Manage Users</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <h2>Manage Users</h2>
        <p className="text-danger">{error || "Access denied."}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Manage Users</h2>

      <div className="mb-3">
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/users/new")}
        >
          Add User
        </button>
      </div>

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Staff</th>
                <th>Phone</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.is_staff ? "Yes" : "No"}</td>
                  <td>{u.phone || ""}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
