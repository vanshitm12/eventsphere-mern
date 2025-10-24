import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';

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
      if (!token) throw new Error('Not authenticated');

      await API.post(`/register/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Registered successfully!');
      setRegistered(true);
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner"></div>
        <p className="text-muted mt-3">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-5">
        <h3>Event Not Found</h3>
        <button onClick={() => navigate('/events')} className="btn btn-primary mt-3">
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="fw-bold mb-3">{event.title}</h2>
      <p className="text-muted">{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>

      {!registered ? (
        <button onClick={handleRegister} className="btn btn-success mt-3">
          Register for Event
        </button>
      ) : (
        <div className="alert alert-success mt-3">You’re registered for this event!</div>
      )}
    </div>
  );
}