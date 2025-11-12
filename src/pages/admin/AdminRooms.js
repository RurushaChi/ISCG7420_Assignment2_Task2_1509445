import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function AdminRooms() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState([]);
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

        const res = await api.get("/rooms/");
        setRooms(res.data);
      } catch (err) {
        console.log("ADMIN ROOMS LOAD ERROR:", err.response?.data || err);
        setError("Unable to load rooms.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const refresh = async () => {
    try {
      const res = await api.get("/rooms/");
      setRooms(res.data);
    } catch (err) {
      console.log("ADMIN ROOMS REFRESH ERROR:", err.response?.data || err);
    }
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await api.delete(`/rooms/${roomId}/`);
      await refresh();
    } catch (err) {
      console.log("ADMIN ROOM DELETE ERROR:", err.response?.data || err);
      alert("Failed to delete room.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Manage Rooms</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <h2>Manage Rooms</h2>
        <p className="text-danger">{error || "Access denied."}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Manage Rooms</h2>

      <div className="mb-3">
        <button
          className="btn btn-success"
          onClick={() => navigate("/admin/rooms/new")}
        >
          Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <p>No rooms found.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Type</th>
                <th>Facilities</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.room_id}>
                  <td>{room.room_id}</td>
                  <td>{room.room_name}</td>
                  <td>{room.capacity}</td>
                  <td>{room.location}</td>
                  <td>{room.room_type}</td>
                  <td>{room.facilities}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() =>
                        navigate(`/admin/rooms/${room.room_id}/edit`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(room.room_id)}
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
