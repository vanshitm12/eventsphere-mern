import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function EventDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await API.get('/events/' + id);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleRegister = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setRegistered(true);
    // API call would go here - keeping structure same
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
        <div className="mb-3" style={{ fontSize: '4rem' }}>😞</div>
        <h3 className="fw-bold mb-2">Event Not Found</h3>
        <p className="text-muted">The event you're looking for doesn't exist</p>
        <button onClick={() => navigate('/events')} className="btn btn-primary mt-3">
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="/events" className="text-decoration-none">Events</a>
          </li>
          <li className="breadcrumb-item active">{event.title}</li>
        </ol>
      </nav>

      {/* Event Header Image */}
      <div className="card card-custom mb-4 border-0 overflow-hidden">
        <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={imageError ? `https://via.placeholder.com/1200x400/0ea5e9/ffffff?text=Event+Image` : (event.imageURL || `https://picsum.photos/seed/${event._id}/1200/400`)}
            className="w-100 h-100"
            style={{ objectFit: 'cover' }}
            alt={event.title}
            onError={() => setImageError(true)}
          />
          <div className="position-absolute bottom-0 start-0 w-100 p-4" 
               style={{ 
                 background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                 color: 'white'
               }}>
            <h1 className="display-5 fw-bold mb-2">{event.title}</h1>
            <div className="d-flex gap-3 align-items-center">
              <span className="badge bg-primary px-3 py-2">
                🎫 Event
              </span>
              <span>📅 {formatDate(event.date)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Content */}
        <div className="col-lg-8">
          <div className="card card-custom p-4 mb-4 border-0">
            <h3 className="fw-bold mb-3">About This Event</h3>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              {event.description}
            </p>
          </div>

          {/* Event Details */}
          <div className="card card-custom p-4 border-0">
            <h4 className="fw-bold mb-4">Event Details</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="fs-4">📅</div>
                  <div>
                    <h6 className="fw-bold mb-1">Date & Time</h6>
                    <p className="text-muted mb-0 small">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="fs-4">📍</div>
                  <div>
                    <h6 className="fw-bold mb-1">Location</h6>
                    <p className="text-muted mb-0 small">
                      {event.location || 'Virtual Event'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="fs-4">👥</div>
                  <div>
                    <h6 className="fw-bold mb-1">Attendees</h6>
                    <p className="text-muted mb-0 small">
                      {event.attendees || Math.floor(Math.random() * 100)} people registered
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="fs-4">🎟️</div>
                  <div>
                    <h6 className="fw-bold mb-1">Organizer</h6>
                    <p className="text-muted mb-0 small">
                      {event.organizer || 'EventSphere Team'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card card-custom p-4 border-0 sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold mb-4">Register for Event</h5>
            
            {event.price && (
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Ticket Price</span>
                  <h4 className="fw-bold mb-0 text-gradient">${event.price}</h4>
                </div>
              </div>
            )}

            {!registered ? (
              <>
                <button 
                  onClick={handleRegister}
                  className="btn btn-primary btn-lg w-100 mb-3"
                >
                  {user ? '🎫 Register Now' : '🔐 Login to Register'}
                </button>
                <p className="text-muted text-center small mb-0">
                  Free cancellation up to 24 hours before
                </p>
              </>
            ) : (
              <div className="alert alert-success mb-0">
                <h6 className="fw-bold mb-2">✅ You're Registered!</h6>
                <p className="small mb-0">
                  Check your email for event details
                </p>
              </div>
            )}

            <hr className="my-4" />

            <div className="d-flex flex-column gap-2">
              <button className="btn btn-outline-secondary btn-sm">
                💾 Save Event
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                📤 Share Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Events */}
      <div className="mt-5">
        <h4 className="fw-bold mb-4">You Might Also Like</h4>
        <div className="row g-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="col-md-4">
              <div className="card card-custom border-0">
                <img
                  src={`https://picsum.photos/seed/${item}/400/250`}
                  className="card-img-top"
                  alt="Similar event"
                />
                <div className="card-body">
                  <h6 className="fw-bold mb-2">Similar Event {item}</h6>
                  <p className="text-muted small mb-3">
                    Check out this related event
                  </p>
                  <a href="/events" className="btn btn-sm btn-outline-primary">
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}