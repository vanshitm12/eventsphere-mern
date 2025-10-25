import React, { useEffect, useState } from "react";
import API, { BASE_URL } from "../api/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mediaBase = BASE_URL.replace(/\/api$/, "");

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        setLoading(true);
        const res = await API.get("/events");
        const all = res.data || [];

        const localUser = JSON.parse(localStorage.getItem("user") || "null");
        const userId = localUser ? localUser.id || localUser._id : null;

        if (!userId) {
          setEvents([]);
          setError("Please log in to see your registered events.");
          return;
        }

        const registeredEvents = all.filter((ev) => {
          if (!ev.registeredUsers) return false;
          return ev.registeredUsers.some((rid) => String(rid) === String(userId));
        });

        setEvents(registeredEvents);
      } catch (err) {
        console.error("Failed to fetch events for dashboard:", err);
        setError("Failed to load dashboard events.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-3">Loading your events...</p>
      </div>
    );

  if (error)
    return (
      <div className="container mt-4 fade-in">
        <div className="alert alert-info">
          <strong>ℹ️ {error}</strong>
        </div>
        <Link to="/login" className="btn btn-primary">
          Login to Continue
        </Link>
      </div>
    );

  return (
    <div className="container mt-4 fade-in">
      <div className="mb-5">
        <h2 className="display-6 fw-bold mb-2">
          <span className="text-gradient">My Events</span>
        </h2>
        <p className="text-muted">Events you're registered for</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4" style={{ fontSize: '4rem' }}>🎫</div>
          <h4 className="mb-3">No Registered Events</h4>
          <p className="text-muted mb-4">
            You haven't registered for any events yet. Start exploring!
          </p>
          <Link to="/events" className="btn btn-primary">
            <span className="me-2">🔍</span>
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {events.map((ev) => {
            const srcField = ev.imageURL || ev.image;
            const imgSrc = srcField
              ? srcField.startsWith("http")
                ? srcField
                : `${mediaBase}/${srcField}`
              : `https://picsum.photos/seed/${ev._id}/600/400`;

            return (
              <div key={ev._id} className="col-md-6 col-lg-4">
                <div className="card card-custom h-100">
                  <div className="img-overlay-container" style={{ height: '200px' }}>
                    <img
                      src={imgSrc}
                      alt={ev.title}
                      className="card-img-top h-100 w-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <span className="badge bg-primary align-self-start mb-2">
                      {ev.category || 'Event'}
                    </span>
                    <h5 className="card-title mb-2">{ev.title}</h5>
                    <p className="card-text text-muted small mb-3">
                      📅 {ev.date ? new Date(ev.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'TBA'}
                    </p>
                    <div className="mt-auto">
                      <Link to={`/events/${ev._id}`} className="btn btn-outline-primary w-100">
                        <span className="me-1">👁️</span>
                        View Details
                      </Link>
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
};

export default Dashboard;