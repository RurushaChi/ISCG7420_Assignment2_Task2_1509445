import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

const ROOM_TYPES = ["Conference", "Seminar", "Huddle"];

export default function AdminRoomForm() {
  const { id } = useParams(); // room_id if editing
  const isEdit = !!id;
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    room_name: "",
    capacity: "",
    location: "",
    facilities: "",
    room_type: "Conference",
    imagePath: "",
    react_image_paths: "", // already present in your state ✅
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const meRes = await api.get("/me/");
        if (!meRes.data.is_staff) {
          setError("Access denied. Admins only.");
          setLoading(false);
          return;
        }
        setIsAdmin(true);

        if (isEdit) {
          const res = await api.get(`/rooms/${id}/`);
          setFormData({
            room_name: res.data.room_name,
            capacity: res.data.capacity,
            location: res.data.location,
            facilities: res.data.facilities || "",
            room_type: res.data.room_type,
            imagePath: res.data.imagePath || "",
            react_image_paths: res.data.react_image_paths || "", // populate ✅
          });
        }
      } catch (err) {
        console.log("ADMIN ROOM FORM INIT ERROR:", err.response?.data || err);
        setError("Unable to load room details.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) || "" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    // Optional: guard against CharField length (255)
    if ((formData.react_image_paths || "").length > 255) {
      setSaving(false);
      setError("React Image Paths must be 255 characters or less.");
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/rooms/${id}/`, formData); // includes react_image_paths ✅
      } else {
        await api.post("/rooms/", formData);
      }
      navigate("/admin/rooms");
    } catch (err) {
      console.log("ADMIN ROOM SAVE ERROR:", err.response?.data || err);
      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError("Failed to save room.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h2>{isEdit ? "Edit Room" : "Add Room"}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <h2>{isEdit ? "Edit Room" : "Add Room"}</h2>
        <p className="text-danger">{error || "Access denied."}</p>
      </div>
    );
  }

  // For preview thumbnails
  const previewImages = (formData.react_image_paths || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="container mt-4">
      <h2>{isEdit ? "Edit Room" : "Add Room"}</h2>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Room Name</label>
          <input
            type="text"
            name="room_name"
            className="form-control"
            value={formData.room_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            name="capacity"
            className="form-control"
            value={formData.capacity}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Room Type</label>
          <select
            name="room_type"
            className="form-select"
            value={formData.room_type}
            onChange={handleChange}
            required
          >
            {ROOM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Facilities</label>
          <textarea
            name="facilities"
            className="form-control"
            rows="3"
            value={formData.facilities}
            onChange={handleChange}
            placeholder="e.g., Projector, Whiteboard, Wi-Fi"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Django Image Paths</label>
          <input
            type="text"
            name="imagePath"
            className="form-control"
            value={formData.imagePath}
            onChange={handleChange}
            placeholder="/static/images/room1.jpg or a URL"
          />
        </div>

        {/* NEW: React Image Paths (comma-separated) */}
        <div className="mb-3">
          <label className="form-label">React Image Paths</label>
          <input
            type="text"
            name="react_image_paths"
            className="form-control"
            value={formData.react_image_paths}
            onChange={handleChange}
            placeholder="/images/rooms/tahi_A.jpg, https://cdn.example.com/room2.jpg"
            maxLength={255}
          />
        </div>
        <button type="submit" className="btn btn-success" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Room"}
        </button>
      </form>
    </div>
  );
}
