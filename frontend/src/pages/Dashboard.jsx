import React, { useEffect, useState } from "react";
import API, { BASE_URL } from "../api/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure we remove /api for image paths
  const mediaBase = BASE_URL.replace(/\/api$/, "");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (error)
    return <div className="alert alert-danger text-center mt-4">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="row">
        {events.length === 0 ? (
          <p className="text-center">No events available</p>
        ) : (
          events.map((ev) => {
            // ✅ Fix: Always prefer imageURL over image
            const imgSrc = ev.imageURL
              ? ev.imageURL.startsWith("http")
                ? ev.imageURL
                : `${mediaBase}/${ev.imageURL}`
              : ev.image
              ? ev.image.startsWith("http")
                ? ev.image
                : `${mediaBase}/${ev.image}`
              : `https://picsum.photos/seed/${ev._id}/600/400`;

            return (
              <div key={ev._id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={imgSrc}
                    alt={ev.title}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{ev.title}</h5>
                    <p className="card-text text-muted">
                      {new Date(ev.date).toLocaleDateString()}
                    </p>
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/event/${ev._id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View
                      </Link>
                      <Link
                        to={`/edit/${ev._id}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;