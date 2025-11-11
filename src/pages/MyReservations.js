import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to view your reservations.");
      setLoading(false);
      return;
    }
    loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReservations = () => {
    setLoading(true);
    setError("");

    api
      .get("/reservations/") // backend filters to current user
      .then((res) => {
        console.log("MY RES DATA:", res.data);
        setReservations(res.data);
      })
      .catch((err) => {
        console.log("MY RES ERROR:", err.response?.data || err);
        if (err.response?.status === 401) {
          setError("Please log in again.");
        } else {
          setError("Unable to load your reservations.");
        }
      })
      .finally(() => setLoading(false));
  };

  const cancelReservation = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }
    try {
      await api.patch(`/reservations/${bookingId}/`, {
        status: "Cancelled",
      });
      loadReservations();
    } catch (err) {
      console.log("CANCEL ERROR:", err.response?.data || err);
      alert("Failed to cancel reservation.");
    }
  };


  if (!token) {
    return (
      <div className="container mt-4">
        <h2>My Reservations</h2>
        <p className="text-danger mt-3">
          You must be logged in to view your reservations.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>My Reservations</h2>
        <p>Loading your reservations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <h2>My Reservations</h2>
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>My Reservations</h2>

      {reservations.length === 0 ? (
        <p className="mt-3">You have no reservations.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Room</th>
                <th>Date</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.booking_id}>
                  <td>{r.room_name || r.room}</td>
                  <td>{r.date}</td>
                  <td>{r.start_time}</td>
                  <td>{r.end_time}</td>
                  <td>{r.status}</td>
                  <td className="text-end">
                    {r.status !== "Cancelled" && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            navigate(`/edit-reservation/${r.booking_id}`)
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => cancelReservation(r.booking_id)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
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
