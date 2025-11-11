import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function AdminReservations() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndLoad = async () => {
      try {
        const meRes = await api.get("/me/");
        if (!meRes.data.is_staff) {
          setError("Access denied. Admins only.");
          setLoading(false);
          return;
        }
        setIsAdmin(true);

        const res = await api.get("/reservations/");
        setReservations(res.data);
      } catch (err) {
        console.log("ADMIN RES ERROR:", err.response?.data || err);
        setError("Unable to load reservations.");
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndLoad();
  }, []);

  const refresh = async () => {
    try {
      const res = await api.get("/reservations/");
      setReservations(res.data);
    } catch (err) {
      console.log("ADMIN RES REFRESH ERROR:", err.response?.data || err);
    }
  };

  const cancelReservation = async (bookingId) => {
    if (!window.confirm("Cancel this reservation?")) return;
    try {
      await api.patch(`/reservations/${bookingId}/`, { status: "Cancelled" });
      await refresh();
    } catch (err) {
      console.log("ADMIN CANCEL ERROR:", err.response?.data || err);
      alert("Failed to cancel reservation.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>Manage Reservations</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <h2>Manage Reservations</h2>
        <p className="text-danger">{error || "Access denied."}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Manage Reservations</h2>

      {reservations.length === 0 ? (
        <p className="mt-3">No reservations found.</p>
      ) : (
        <div className="table-responsive mt-3">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Room</th>
                <th>User</th>
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
                  <td>{r.booking_id}</td>
                  <td>{r.room_name || r.room}</td>
                  <td>{r.username || r.user}</td>
                  <td>{r.date}</td>
                  <td>{r.start_time}</td>
                  <td>{r.end_time}</td>
                  <td>{r.status}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => navigate(`/edit-reservation/${r.booking_id}`)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => cancelReservation(r.booking_id)}
                    >
                      Cancel
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
