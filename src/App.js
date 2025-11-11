import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoomsList from "./pages/RoomsList";
import MyReservations from "./pages/MyReservations";

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
          <Route path="/my-reservations" element={<MyReservations />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
