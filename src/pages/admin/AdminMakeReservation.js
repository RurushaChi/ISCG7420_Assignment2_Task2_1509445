import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const minDate = tomorrow.toISOString().split("T")[0];

export default function AdminMakeReservation() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    user: "",
    room: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await api.get("/me/");
        if (!meRes.data.is_staff) {
          setError("Access denied. Admins only.");
          return;
        }
        setIsAdmin(true);

        const [roomsRes, usersRes] = await Promise.all([
          api.get("/rooms/"),
          api.get("/users/"),
        ]);

        setRooms(roomsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.log("ADMIN MAKE INIT ERROR:", err.response?.data || err);
        setError("Unable to load data.");
      }
    };

    init();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/reservations/", formData);
      // Optional: brief success then navigate
      setSuccess("Reservation created successfully!");
      setTimeout(() => navigate("/admin/reservations"), 600);
    } catch (err) {
      console.log("ADMIN MAKE ERROR:", err.response?.data || err);
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to create reservation.");
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <h2>Admin Make Reservation</h2>
        <p className="text-danger mt-3">{error || "Access denied."}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Admin Make Reservation</h2>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/reservations")}
        >
          Back to Reservations
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        {/* User */}
        <div className="mb-3">
          <label className="form-label">User</label>
          <select
            name="user"
            className="form-select"
            value={formData.user}
            onChange={handleChange}
            required
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Room */}
        <div className="mb-3">
          <label className="form-label">Room</label>
          <select
            name="room"
            className="form-select"
            value={formData.room}
            onChange={handleChange}
            required
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_name} ({room.location}) — {room.capacity} people
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={formData.date}
            onChange={handleChange}
            required
            min={minDate}     // block today & past
          />
        </div>

        {/* Times */}
        <div className="mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            name="start_time"
            className="form-control"
            value={formData.start_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">End Time</label>
          <input
            type="time"
            name="end_time"
            className="form-control"
            value={formData.end_time}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Create Reservation
        </button>
      </form>
    </div>
  );
}
