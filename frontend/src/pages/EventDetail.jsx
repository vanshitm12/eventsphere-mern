import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { BASE_URL } from "../api/api";

/**
 * EventDetail page
 * - fetches one event
 * - shows image (handles imageURL vs image and absolute vs relative)
 * - allows authenticated user to register (POST /api/register/:eventId)
 * - after successful registration, marks registered = true so dashboard filtering will apply
 */
export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [qrDataURL, setQrDataURL] = useState(null);
  const mediaBase = BASE_URL.replace(/\/api$/, ""); // safe origin for images

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/events/${id}`);
        setEvent(res.data || null);

        // detect if current user is in registeredUsers (if logged in)
        try {
          const localUser = JSON.parse(localStorage.getItem("user") || "null");
          if (localUser && res.data?.registeredUsers) {
            const uid = localUser.id || localUser._id;
            // registeredUsers may be array of ObjectId strings
            const isRegistered = res.data.registeredUsers.some(
              (r) => String(r) === String(uid)
            );
            setRegistered(Boolean(isRegistered));
          }
        } catch (e) {
          // ignore parse error
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // user not logged in: redirect to login (or show message)
      return alert("Please log in to register for events.");
    }

    try {
      const res = await API.post(`/register/${id}`);
      // server returns { message, qrCode } in this project
      if (res.data?.qrCode) {
        setQrDataURL(res.data.qrCode);
      }
      setRegistered(true);

      // optimistic UI: also update event.registeredUsers locally so the UI reflects registration
      setEvent((prev) => {
        if (!prev) return prev;
        const localUser = JSON.parse(localStorage.getItem("user") || "null");
        const uid = localUser ? localUser.id || localUser._id : null;
        if (uid && !(prev.registeredUsers || []).some((r) => String(r) === String(uid))) {
          return { ...prev, registeredUsers: [...(prev.registeredUsers || []), uid] };
        }
        return prev;
      });
      alert("Registered successfully!");
    } catch (err) {
      console.error("Registration error:", err);
      const msg = err?.response?.data?.message || "Registration failed";
      alert(msg);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  if (error)
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );

  if (!event) return null;

  // Build image URL using imageURL preferred field, fallback to image, then placeholder.
  const srcField = event.imageURL || event.image;
  const imgSrc = srcField
    ? srcField.startsWith("http")
      ? srcField
      : `${mediaBase}/${srcField}`
    : `https://picsum.photos/seed/${event._id}/900/500`;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <img
          src={imgSrc}
          alt={event.title}
          className="img-fluid rounded-top"
          style={{ maxHeight: 450, objectFit: "cover", width: "100%" }}
        />
        <div className="card-body">
          <h2 className="card-title">{event.title}</h2>
          <p className="text-muted mb-1">
            {event.date ? new Date(event.date).toLocaleString() : ""}
          </p>
          <p className="mb-2">
            <strong>Location:</strong> {event.location || "TBA"}
          </p>
          <p className="mb-2">
            <strong>Category:</strong> {event.category || "General"}
          </p>
          <p className="card-text">{event.description}</p>

          {!registered ? (
            <button onClick={handleRegister} className="btn btn-success mt-3">
              Register for Event
            </button>
          ) : (
            <div className="alert alert-success mt-3">
              You’re registered for this event!
            </div>
          )}

          {qrDataURL && (
            <div className="mt-3">
              <h6>Your QR code (save this):</h6>
              <img src={qrDataURL} alt="QR code" style={{ maxWidth: 240 }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}