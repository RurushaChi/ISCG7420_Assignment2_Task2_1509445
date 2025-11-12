import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoomsList from "./pages/RoomsList";
import MakeReservation from "./pages/MakeReservation";
import MyReservations from "./pages/MyReservations";
import EditReservation from "./pages/EditReservation";


import AdminReservations from "./pages/admin/AdminReservations";
import AdminMakeReservation from "./pages/admin/AdminMakeReservation";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminRoomForm from "./pages/admin/AdminRoomForm";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminUserForm from "./pages/admin/AdminUserForm";


import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/make-reservation" element={<MakeReservation />} />
          <Route path="/edit-reservation/:id" element={<EditReservation />} />
          <Route path="/my-reservations" element={<MyReservations />} />
          {/* Admin - Reservations */}
          <Route path="/admin-Reservations" element={<AdminReservations />} />
          <Route path="/admin-make-reservation" element={<AdminMakeReservation />} />
          {/* Admin - Rooms */}
          <Route path="/admin/rooms" element={<AdminRooms />} />
          <Route path="/admin/rooms/new" element={<AdminRoomForm />} />
          <Route path="/admin/rooms/:id/edit" element={<AdminRoomForm />} />
          {/* Admin - Users */}
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/new" element={<AdminUserForm />} />
          <Route path="/admin/users/:id/edit" element={<AdminUserForm />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
