import { useEffect, useState } from "react";
import api from "../api";

export default function MakeReservation() {
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access"));

  // Always call hooks at the top: load rooms if logged in
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsLoggedIn(false);
      setLoadingRooms(false);
      return;
    }

    setIsLoggedIn(true);

    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        setError("");

        const res = await api.get("/rooms/");
        console.log("ROOMS FOR RESERVATION:", res.data);
        setRooms(res.data);
      } catch (err) {
        console.log("ROOMS LOAD ERROR:", err.response?.data || err);
        setError("Unable to load rooms. Please try again.");
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchRooms();
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
      await api.post("/reservations/", {
        room: formData.room,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      setSuccess("Reservation created successfully!");
      setFormData({
        room: "",
        date: "",
        start_time: "",
        end_time: "",
      });
    } catch (err) {
      console.log("CREATE RES ERROR:", err.response?.data || err);
      if (err.response?.data) {
        const data = err.response.data;
        setError(typeof data === "string" ? data : JSON.stringify(data));
      } else {
        setError("Failed to create reservation.");
      }
    }
  };

  // 🔒 Not logged in
  if (!isLoggedIn) {
    return (
      <div className="container mt-4">
        <h2>Make a Reservation</h2>
        <p className="text-danger mt-3">
          You must be logged in to make a reservation.
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Make a Reservation</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}

      {loadingRooms ? (
        <p className="mt-3">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className="mt-3">No rooms available to book.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-3">
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
            />
          </div>

          {/* Start Time */}
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

          {/* End Time */}
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
            Confirm Reservation
          </button>
        </form>
      )}
    </div>
  );
}
