import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API, { BASE_URL } from "../api/api";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove /api from baseURL for media files
  const mediaBase = BASE_URL.replace(/\/api$/, "");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (error)
    return <div className="alert alert-danger text-center mt-4">{error}</div>;

  if (!event) return null;

  // ✅ Fix: Use imageURL instead of image
  const imgSrc = event.imageURL
    ? event.imageURL.startsWith("http")
      ? event.imageURL
      : `${mediaBase}/${event.imageURL}`
    : `https://picsum.photos/seed/${event._id}/600/400`;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <img
          src={imgSrc}
          alt={event.title}
          className="img-fluid rounded-top"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h2 className="card-title">{event.title}</h2>
          <p className="text-muted mb-1">
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className="mb-3">{event.location}</p>
          <p className="card-text">{event.description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;