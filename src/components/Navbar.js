import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load current user if token exists
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      setUser(null);
      return;
    }

    api
      .get("/me/")
      .then((res) => setUser(res.data))
      .catch(() => {
        // invalid token
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    navigate("/login");
  };

  const isAdmin = user?.is_staff;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand" to="/">
          Te Whare Rūnanga
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* View Rooms - always visible */}
            <li className="nav-item">
              <Link className="nav-link" to="/rooms">
                View Rooms
              </Link>
            </li>

            {user ? (
              <>
                {isAdmin ? (
                  // Admin Manage dropdown
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle btn btn-link"
                      id="manageDropdown"
                      data-bs-toggle="dropdown"
                    >
                      Manage
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="manageDropdown">
                      <li>
                        <Link className="dropdown-item" to="/admin/rooms">
                          Rooms
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/reservations">
                          Reservations
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/admin/users">
                          Users
                        </Link>
                      </li>
                    </ul>
                  </li>
                ) : (
                  <>
                    {/* Regular user */}
                    <li className="nav-item">
                      <Link className="nav-link" to="/make-reservation">
                        Make Reservation
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-reservations">
                        Manage Bookings
                      </Link>
                    </li>
                  </>
                )}

                {/* User dropdown */}
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                  >
                    Welcome, {user.username}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      <button className="dropdown-item" disabled>
                        Profile (coming soon)
                      </button>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              // Not logged in
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Create Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
