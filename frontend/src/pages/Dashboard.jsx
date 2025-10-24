import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegisteredEvents = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setEvents(JSON.parse(localStorage.getItem('registeredEvents') || '[]'));
      setLoading(false);
      return;
    }

    try {
      const res = await API.get('/register/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data || []);
    } catch (err) {
      console.error('Error fetching registered events:', err);
      // fallback to localStorage
      const localEvents = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
      setEvents(localEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading your dashboard...</p>;

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4 text-center">My Registered Events</h2>

      {events.length === 0 ? (
        <p className="text-center text-muted">You haven’t registered for any events yet.</p>
      ) : (
        <div className="row">
          {events.map((ev) => (
            <div key={ev._id} className="col-md-4 mb-4">
              <div className="card shadow-sm border-0">
                <img
                  src={ev.image || '/placeholder.jpg'}
                  alt={ev.title}
                  className="card-img-top"
                  style={{ height: '180px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{ev.title}</h5>
                  <p className="card-text text-muted">{ev.location}</p>
                  <Link to={`/events/${ev._id}`} className="btn btn-outline-primary btn-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}