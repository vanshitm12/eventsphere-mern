import React, { useEffect, useState } from 'react';
import API, { BASE_URL } from '../api/api';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';

/**
 * Admin page that supports:
 * - Listing all events (GET /events)
 * - Creating an event (POST /events)
 * - Editing an event (PUT /events/:id)
 * - Deleting an event (DELETE /events/:id)
 *
 * Uses a simple form with fields: title, description, date, imageURL
 * Assumes backend uses JWT and checks role; frontend attaches token via API interceptor.
 */

export default function Admin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', date: '', imageURL: '' });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const isCreateRoute = location.pathname.endsWith('/create');
  const isEditRoute = !!params.id;

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // if navigated to /admin/create reset form
    if (isCreateRoute) {
      setEditingId(null);
      setForm({ title: '', description: '', date: '', imageURL: '' });
    }
    // if navigated to /admin/edit/:id, load the event into form
    if (isEditRoute) {
      const id = params.id;
      const ev = events.find(x => x._id === id);
      if (ev) {
        setEditingId(id);
        setForm({
          title: ev.title || '',
          description: ev.description || '',
          date: ev.date ? new Date(ev.date).toISOString().slice(0,16) : '',
          imageURL: ev.imageURL || ev.image || ''
        });
      } else {
        // If events not loaded yet, fetch single event
        (async () => {
          try {
            const res = await API.get(`/events/${id}`);
            const ev2 = res.data;
            setEditingId(id);
            setForm({
              title: ev2.title || '',
              description: ev2.description || '',
              date: ev2.date ? new Date(ev2.date).toISOString().slice(0,16) : '',
              imageURL: ev2.imageURL || ev2.image || ''
            });
          } catch (err) {
            console.error(err);
            setError('Failed to load event for editing.');
          }
        })();
      }
    }
  }, [location.pathname, params.id, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await API.get('/events');
      setEvents(res.data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await API.delete(`/events/${id}`);
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to delete');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        date: form.date ? new Date(form.date).toISOString() : undefined,
        imageURL: form.imageURL || undefined,
      };
      let res;
      if (editingId) {
        res = await API.put(`/events/${editingId}`, payload);
      } else {
        res = await API.post('/events', payload);
      }
      await fetchEvents();
      setForm({ title: '', description: '', date: '', imageURL: '' });
      setEditingId(null);
      navigate('/admin');
      alert('Saved successfully.');
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (ev) => {
    setEditingId(ev._id);
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      date: ev.date ? new Date(ev.date).toISOString().slice(0,16) : '',
      imageURL: ev.imageURL || ev.image || ''
    });
    navigate(`/admin/edit/${ev._id}`);
  };

  const startCreate = () => {
    setEditingId(null);
    setForm({ title: '', description: '', date: '', imageURL: '' });
    navigate('/admin/create');
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2>Admin — Manage Events</h2>
        <div>
          <button className="btn btn-primary" onClick={startCreate}>Create Event</button>
          <Link to="/events" className="btn btn-link">View Events</Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h4>Events</h4>
          {loading ? <p>Loading...</p> : error ? <p className="text-danger">{error}</p> : (
            <div>
              {events.map(ev => (
                <div key={ev._id} className="card mb-2">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{ev.title}</strong><br/>
                      <small className="text-muted">{ev.date ? new Date(ev.date).toLocaleString() : 'TBA'}</small>
                    </div>
                    <div>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(ev)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(ev._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h4>{editingId ? 'Edit Event' : (isCreateRoute ? 'Create Event' : 'Event Form')}</h4>
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={4} />
            </div>
            <div className="mb-3">
              <label className="form-label">Date & Time</label>
              <input type="datetime-local" className="form-control" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Image URL (or relative path)</label>
              <input className="form-control" value={form.imageURL} onChange={e => setForm({...form, imageURL: e.target.value})} />
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-success" disabled={saving}>{saving ? 'Saving...' : (editingId ? 'Update Event' : 'Create Event')}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setForm({ title: '', description: '', date: '', imageURL: '' }); setEditingId(null); navigate('/admin'); }}>Reset</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
