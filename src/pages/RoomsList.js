import { useEffect, useState } from "react";
import api from "../api";

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api
      .get("/rooms/")
      .then((res) => setRooms(res.data))
      .catch((err) => console.error("Error loading rooms:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Available Rooms</h2>
      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        <div className="row">
          {rooms.map((room) => (
            <div className="col-md-4 mb-3" key={room.room_id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{room.room_name}</h5>
                  <p className="card-text">
                    Type: {room.room_type} <br />
                    Capacity: {room.capacity} <br />
                    Location: {room.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
