import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Helper: load current user from /api/me/
  const loadUser = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setUser(null);
      return;
    }

    api
      .get("/me/")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        // token invalid/expired
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
      });
  };

  useEffect(() => {
    // Initial load on mount
    loadUser();

    // Listen for auth changes (login/logout)
    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("storage", handleAuthChange); // in case we use storage events

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    // notify rest of app
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/login");
  };

  const isLoggedIn = !!user;
  const isAdmin = user?.is_staff;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/rooms">
          Te Whare Rūnanga
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* View Rooms - always visible */}
            <li className="nav-item">
              <Link className="nav-link" to="/rooms">
                View Rooms
              </Link>
            </li>

            {isLoggedIn ? (
              <>
                {isAdmin ? (
                  // Admin menu like your Django base.html
                  <li className="nav-item dropdown">
                    <button
                      className="nav-link dropdown-toggle btn btn-link"
                      id="manageDropdown"
                      data-bs-toggle="dropdown"
                    >
                      Manage
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="manageDropdown"
                    >
                      <li>
                        <Link className="dropdown-item" to="/admin/rooms">
                          Rooms
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admin/reservations"
                        >
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
                  // Regular user options
                  <>
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

                {/* Welcome + Logout */}
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
                      <button
                        className="dropdown-item"
                        onClick={handleLogout}
                      >
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
