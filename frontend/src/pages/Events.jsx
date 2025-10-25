import React, { useEffect, useState } from 'react';
import API, { BASE_URL } from '../api/api';
import { Link } from 'react-router-dom';

function EventCard({ e, onDelete, isAdmin }) {
  const imageSrc = e.imageURL
    ? (e.imageURL.startsWith('http') ? e.imageURL : `${BASE_URL.replace(/\/api$/, '')}/${e.imageURL}`)
    : `https://picsum.photos/seed/${e._id}/600/400`;

  return (
    <div className="card card-custom mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={imageSrc} alt={e.title} className="img-fluid rounded-start" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{e.title}</h5>
            <p className="card-text text-muted">{e.date ? new Date(e.date).toLocaleString() : 'TBA'}</p>
            <p className="card-text">{e.description?.slice(0,150)}</p>
            <div className="d-flex gap-2">
              <Link to={`/events/${e._id}`} className="btn btn-outline-primary btn-sm">View</Link>
              {isAdmin && (
                <>
                  <Link to={`/admin/edit/${e._id}`} className="btn btn-warning btn-sm">Edit</Link>
                  <button onClick={() => onDelete(e._id)} className="btn btn-danger btn-sm">Delete</button>
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
      // Remove locally (optimistic)
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete event');
    }
  };

  const filtered = events.filter(e => !q || (e.title || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2>All Events</h2>
        <div className="d-flex gap-2" style={{width: '50%'}}>
          <input placeholder="Search events..." value={q} onChange={e=>setQ(e.target.value)} className="form-control" />
          {isAdmin && <Link to="/admin/create" className="btn btn-primary">Create Event</Link>}
        </div>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <div>
          {filtered.map(e => <EventCard key={e._id} e={e} onDelete={handleDelete} isAdmin={isAdmin} />)}
          {filtered.length === 0 && <p className="text-muted">No events found.</p>}
        </div>
      )}
    </div>
  );
}
