import React, { useEffect, useState } from 'react';
import API, { BASE_URL } from '../api/api';
import { Link } from 'react-router-dom';

function EventCard({ e, onDelete, isAdmin }) {
  const imageSrc = e.imageURL
    ? (e.imageURL.startsWith('http') ? e.imageURL : `${BASE_URL.replace(/\/api$/, '')}/${e.imageURL}`)
    : `https://picsum.photos/seed/${e._id}/600/400`;

  return (
    <div className="card card-custom mb-4 slide-in">
      <div className="row g-0">
        <div className="col-md-4">
          <div className="img-overlay-container" style={{ height: '100%', minHeight: '250px' }}>
            <img 
              src={imageSrc} 
              alt={e.title} 
              className="img-fluid h-100 w-100"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="col-md-8">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="card-title mb-0">{e.title}</h5>
              <span className="badge bg-primary">{e.category || 'Event'}</span>
            </div>
            <div className="d-flex align-items-center text-muted mb-3">
              <span className="me-3">
                📅 {e.date ? new Date(e.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) : 'TBA'}
              </span>
              <span>
                🕐 {e.date ? new Date(e.date).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : 'TBA'}
              </span>
            </div>
            <p className="card-text text-muted mb-3">
              {e.description?.slice(0, 150)}
              {e.description?.length > 150 && '...'}
            </p>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Link to={`/events/${e._id}`} className="btn btn-primary btn-sm">
                <span className="me-1">👁️</span>
                View Details
              </Link>
              {isAdmin && (
                <>
                  <Link to={`/admin/edit/${e._id}`} className="btn btn-warning btn-sm">
                    <span className="me-1">✏️</span>
                    Edit
                  </Link>
                  <button onClick={() => onDelete(e._id)} className="btn btn-danger btn-sm">
                    <span className="me-1">🗑️</span>
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('user');
    try {
      const u = raw ? JSON.parse(raw) : null;
      setIsAdmin(!!(u && (u.role === 'admin' || u.roles?.includes && u.roles.includes('admin'))));
    } catch (err) {
      setIsAdmin(false);
    }
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/events');
      setEvents(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete event');
    }
  };

  const filtered = events.filter(e => !q || (e.title || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="display-6 fw-bold mb-2">
              <span className="text-gradient">Discover Events</span>
            </h2>
            <p className="text-muted mb-0">Find amazing experiences happening near you</p>
          </div>
          {isAdmin && (
            <Link to="/admin/create" className="btn btn-primary">
              <span className="me-2">➕</span>
              Create Event
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="🔍 Search events by name..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading amazing events...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <div>
          {filtered.length > 0 ? (
            <>
              <div className="mb-3">
                <small className="text-muted">
                  Showing {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
                </small>
              </div>
              {filtered.map(e => (
                <EventCard key={e._id} e={e} onDelete={handleDelete} isAdmin={isAdmin} />
              ))}
            </>
          ) : (
            <div className="text-center py-5">
              <div className="mb-4" style={{ fontSize: '4rem' }}>🔍</div>
              <h4 className="mb-3">No Events Found</h4>
              <p className="text-muted mb-4">
                {q ? `No events match "${q}". Try a different search term.` : 'No events are currently available.'}
              </p>
              {isAdmin && (
                <Link to="/admin/create" className="btn btn-primary">
                  <span className="me-2">➕</span>
                  Create Your First Event
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}