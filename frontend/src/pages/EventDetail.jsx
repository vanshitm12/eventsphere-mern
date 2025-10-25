import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API, { BASE_URL } from "../api/api";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [qrDataURL, setQrDataURL] = useState(null);
  const mediaBase = BASE_URL.replace(/\/api$/, "");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/events/${id}`);
        setEvent(res.data || null);

        try {
          const localUser = JSON.parse(localStorage.getItem("user") || "null");
          if (localUser && res.data?.registeredUsers) {
            const uid = localUser.id || localUser._id;
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
      return alert("Please log in to register for events.");
    }

    try {
      const res = await API.post(`/register/${id}`);
      if (res.data?.qrCode) {
        setQrDataURL(res.data.qrCode);
      }
      setRegistered(true);

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
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading event details...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-4 fade-in">
        <div className="alert alert-danger">{error}</div>
        <Link to="/events" className="btn btn-outline-primary">
          ← Back to Events
        </Link>
      </div>
    );

  if (!event) return null;

  const srcField = event.imageURL || event.image;
  const imgSrc = srcField
    ? srcField.startsWith("http")
      ? srcField
      : `${mediaBase}/${srcField}`
    : `https://picsum.photos/seed/${event._id}/900/500`;

  return (
    <div className="container mt-4 fade-in">
      <Link to="/events" className="btn btn-outline-primary mb-4">
        <span className="me-2">←</span>
        Back to Events
      </Link>

      <div className="card card-custom shadow-lg border-0">
        <div className="img-overlay-container" style={{ maxHeight: '500px', overflow: 'hidden' }}>
          <img
            src={imgSrc}
            alt={event.title}
            className="img-fluid w-100"
            style={{ objectFit: 'cover', height: '500px' }}
          />
        </div>
        
        <div className="card-body p-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="mb-4">
                <span className="badge bg-primary mb-3">{event.category || 'Event'}</span>
                <h1 className="display-5 fw-bold mb-3">{event.title}</h1>
              </div>

              <div className="d-flex flex-wrap gap-4 mb-4 pb-4 border-bottom">
                <div>
                  <div className="text-muted small mb-1">📅 Date</div>
                  <div className="fw-semibold">
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'TBA'}
                  </div>
                </div>
                <div>
                  <div className="text-muted small mb-1">🕐 Time</div>
                  <div className="fw-semibold">
                    {event.date ? new Date(event.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'TBA'}
                  </div>
                </div>
                <div>
                  <div className="text-muted small mb-1">📍 Location</div>
                  <div className="fw-semibold">{event.location || "TBA"}</div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="fw-bold mb-3">About This Event</h5>
                <p className="text-muted" style={{ lineHeight: '1.8' }}>
                  {event.description || 'No description available.'}
                </p>
              </div>

              {!registered ? (
                <button onClick={handleRegister} className="btn btn-success btn-lg">
                  <span className="me-2">🎫</span>
                  Register for Event
                </button>
              ) : (
                <div className="alert alert-success d-flex align-items-center">
                  <span className="me-2" style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <strong>You're registered!</strong>
                    <p className="mb-0 mt-1">You're all set for this event. See you there!</p>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4">
              {qrDataURL && (
                <div className="card card-custom p-4 text-center">
                  <h6 className="fw-bold mb-3">Your QR Code</h6>
                  <img src={qrDataURL} alt="QR code" className="img-fluid mb-3" style={{ maxWidth: 240, margin: '0 auto' }} />
                  <p className="text-muted small mb-0">Save this QR code for event check-in</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}