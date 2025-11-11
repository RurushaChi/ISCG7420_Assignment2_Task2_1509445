import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

export default function EditReservation() {
  const { id } = useParams(); // booking_id
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room: "",
    date: "",
    start_time: "",
    end_time: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to edit a reservation.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Load rooms
        const roomsRes = await api.get("/rooms/");
        setRooms(roomsRes.data);

        // Load reservation details
        const resRes = await api.get(`/reservations/${id}/`);
        const r = resRes.data;

        setFormData({
          room: r.room,
          date: r.date,
          start_time: r.start_time,
          end_time: r.end_time,
        });
      } catch (err) {
        console.log("EDIT LOAD ERROR:", err.response?.data || err);
        setError("Unable to load reservation.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
      await api.patch(`/reservations/${id}/`, {
        room: formData.room,
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
      });

      navigate("/my-reservations");
    } catch (err) {
      console.log("EDIT SAVE ERROR:", err.response?.data || err);
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to update reservation.");
      }
    }
  };

  if (!token) {
    return (
      <div className="container mt-4">
        <h2>Edit Reservation</h2>
        <p className="text-danger mt-3">
          You must be logged in to edit a reservation.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Edit Reservation</h2>
        <p>Loading reservation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2>Edit Reservation</h2>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Edit Reservation</h2>

      <form onSubmit={handleSubmit} className="mt-3">
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

        <button type="submit" className="btn btn-primary me-2">
          Save Changes
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/my-reservations")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
