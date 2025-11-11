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



function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<RoomsList />} />
          <Route path="/rooms" element={<RoomsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/make-reservation" element={<MakeReservation />} />
          <Route path="/edit-reservation/:id" element={<EditReservation />} />
          <Route path="/my-reservations" element={<MyReservations />} />

          <Route path="/admin-Reservations" element={<AdminReservations />} />
          <Route path="/admin-make-reservation" element={<AdminMakeReservation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
