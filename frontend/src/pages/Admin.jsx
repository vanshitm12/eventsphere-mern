import React, { useEffect, useState } from 'react';
import API, { BASE_URL } from '../api/api';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';

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
    if (isCreateRoute) {
      setEditingId(null);
      setForm({ title: '', description: '', date: '', imageURL: '' });
    }
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
    <div className="fade-in">
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <h2 className="display-6 fw-bold mb-2">
            <span className="text-gradient">Admin Panel</span>
          </h2>
          <p className="text-muted mb-0">Manage your events</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={startCreate}>
            <span className="me-2">➕</span>
            Create Event
          </button>
          <Link to="/events" className="btn btn-outline-primary">
            <span className="me-2">👁️</span>
            View Events
          </Link>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card card-custom p-4">
            <h4 className="fw-bold mb-4">All Events</h4>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <div className="event-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {events.map(ev => (
                  <div key={ev._id} className="card mb-3 border">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1">{ev.title}</h6>
                          <small className="text-muted">
                            📅 {ev.date ? new Date(ev.date).toLocaleString() : 'TBA'}
                          </small>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-warning" 
                            onClick={() => startEdit(ev)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            onClick={() => handleDelete(ev._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted">No events yet. Create your first event!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card card-custom p-4">
            <h4 className="fw-bold mb-4">
              {editingId ? '✏️ Edit Event' : (isCreateRoute ? '➕ Create Event' : 'Event Form')}
            </h4>
            <form onSubmit={submit}>
              <div className="mb-4">
                <label className="form-label">Event Title *</label>
                <input 
                  className="form-control" 
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})} 
                  placeholder="Enter event title"
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  rows={5}
                  placeholder="Describe your event..."
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Date & Time</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  value={form.date} 
                  onChange={e => setForm({...form, date: e.target.value})} 
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Image URL</label>
                <input 
                  className="form-control" 
                  value={form.imageURL} 
                  onChange={e => setForm({...form, imageURL: e.target.value})} 
                  placeholder="https://example.com/image.jpg"
                />
                <small className="text-muted">Enter full URL or relative path</small>
              </div>

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-success flex-grow-1" 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="me-2">{editingId ? '💾' : '➕'}</span>
                      {editingId ? 'Update Event' : 'Create Event'}
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => { 
                    setForm({ title: '', description: '', date: '', imageURL: '' }); 
                    setEditingId(null); 
                    navigate('/admin'); 
                  }}
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}