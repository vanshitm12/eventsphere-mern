import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';
import { BASE_URL } from "../api/api";

export default function EventDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!user && !storedUser) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      await API.post(`/register/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('✅ Successfully registered for this event!');
      setRegistered(true);

      // ✅ Add event to dashboard list in localStorage for instant UI update
      const regEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      if (!regEvents.find((e) => e._id === event._id)) {
        regEvents.push(event);
        localStorage.setItem('registeredEvents', JSON.stringify(regEvents));
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err.response?.data?.message || 'Registration failed, please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3 text-muted">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-5">
        <h4>Event not found</h4>
        <button onClick={() => navigate('/events')} className="btn btn-primary mt-3">
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6">
        <img
             src={
            event.image
            ? event.image.startsWith("http")
            ? event.image
            : `${BASE_URL}/${event.image}`
            : "/placeholder.jpg"
                }
  alt={event.title}
  className="img-fluid rounded shadow-sm mb-4"
/>
        </div>

        <div className="col-md-6 d-flex flex-column justify-content-center">
          <h2 className="fw-bold">{event.title}</h2>
          <p className="text-muted mb-3">{event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Category:</strong> {event.category}</p>

          {!registered ? (
            <button onClick={handleRegister} className="btn btn-success mt-3">
              Register for Event
            </button>
          ) : (
            <div className="alert alert-success mt-3">You’re registered for this event!</div>
          )}
        </div>
      </div>
    </div>
  );
}