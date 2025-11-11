import { useEffect, useState } from "react";
import api from "../api";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    api.get("/reservations/my/")
      .then((res) => setReservations(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ margin: "2rem" }}>
      <h2>My Reservations</h2>
      <ul>
        {reservations.map((r) => (
          <li key={r.booking_id}>
            {r.room.room_name} — {r.date} ({r.start_time}–{r.end_time})
            <em> [{r.status}]</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
