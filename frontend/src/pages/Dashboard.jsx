import React, { useEffect, useState } from "react";
import API, { BASE_URL } from "../api/api";
import { Link } from "react-router-dom";

/**
 * Dashboard — shows only events the logged-in user is registered for.
 * - reads user from localStorage: { id, name, ... } (set on login)
 * - fetches all events and filters by registeredUsers containing user.id
 * - image handling consistent with other pages (imageURL preferred)
 */
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

        // get logged-in user id from localStorage
        const localUser = JSON.parse(localStorage.getItem("user") || "null");
        const userId = localUser ? localUser.id || localUser._id : null;

        if (!userId) {
          // not logged in — show helpful message
          setEvents([]);
          setError("Please log in to see your registered events.");
          return;
        }

        // Filter events where registeredUsers includes userId
        const registeredEvents = all.filter((ev) => {
          if (!ev.registeredUsers) return false;
          // registeredUsers may be array of ObjectId strings
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
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );

  if (error)
    return (
      <div className="container mt-4">
        <div className="alert alert-info">{error}</div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Registered Events</h2>

      {events.length === 0 ? (
        <p className="text-center text-muted">You have not registered for any events yet.</p>
      ) : (
        <div className="row">
          {events.map((ev) => {
            const srcField = ev.imageURL || ev.image;
            const imgSrc = srcField
              ? srcField.startsWith("http")
                ? srcField
                : `${mediaBase}/${srcField}`
              : `https://picsum.photos/seed/${ev._id}/600/400`;

            return (
              <div key={ev._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={imgSrc}
                    alt={ev.title}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{ev.title}</h5>
                    <p className="card-text text-muted">
                      {ev.date ? new Date(ev.date).toLocaleDateString() : ""}
                    </p>
                    <div className="d-flex justify-content-between">
                      <Link to={`/event/${ev._id}`} className="btn btn-sm btn-outline-primary">
                        View
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