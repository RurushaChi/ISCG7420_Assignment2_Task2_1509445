import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function RoomsList() {
  const [rooms, setRooms] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const parseImages = (value) =>
    (value || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

  useEffect(() => {
    api.get("/rooms/").then(res => setRooms(res.data)).catch(console.error);

    const token = localStorage.getItem("access");
    if (!token) return;
    api.get("/me/").then(() => setIsLoggedIn(true)).catch(() => setIsLoggedIn(false));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Available Rooms</h2>

      {rooms.length === 0 ? (
        <p className="mt-3">No rooms available at this time.</p>
      ) : (
        <div className="row">
          {rooms.map((room) => {
            const images = parseImages(room.react_image_paths);
            const collapseId = `room${room.room_id}`;
            const carouselId = `carousel${room.room_id}`;

            return (
              <div className="col-12 mb-3" key={room.room_id}>
                <div className="card shadow-sm">
                  <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <span>{room.room_name}</span>
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${collapseId}`}
                      aria-expanded="false"
                      aria-controls={collapseId}
                    >
                      View Details
                    </button>
                  </div>

                  <div id={collapseId} className="collapse">
                    <div className="card-body">

                      {/* Carousel */}
                      {images.length > 0 && (
                        <div id={carouselId} className="carousel slide mb-3" data-bs-ride="carousel">
                          <div className="carousel-inner">
                            {images.map((src, idx) => (
                              <div key={src + idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                                <img
                                  src={src}
                                  className="d-block w-100 rounded img-fluid shadow"
                                  style={{ maxHeight: "450px", objectFit: "cover" }}
                                  alt={`Room ${room.room_name}`}
                                  onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = "/images/rooms/default_room.jpg";
                                  }}
                                />
                              </div>
                            ))}
                          </div>

                          {images.length > 1 && (
                            <>
                              <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                              </button>
                              <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {/* Details */}
                      <p><strong>Capacity:</strong> {room.capacity}</p>
                      <p><strong>Location:</strong> {room.location}</p>
                      <p><strong>Facilities:</strong> {room.facilities}</p>
                      <p><strong>Type:</strong> {room.room_type}</p>

                      {isLoggedIn ? (
                        <Link to="/make-reservation" className="btn btn-primary mt-2">
                          Book This Room
                        </Link>
                      ) : (
                        <Link to="/login" className="btn btn-secondary mt-2">
                          Login to Book
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

