import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-12">
              <h1 className="hero-title">
                Discover Amazing Events
                <br />
                <span className="text-gradient">Near You</span>
              </h1>
              <p className="hero-subtitle">
                Join, manage, and create unforgettable experiences with EventSphere.
                Connect with your community through events that matter.
              </p>
              <div className="mt-4 d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/events" className="btn btn-primary btn-lg">
                  <span className="me-2">🎯</span>
                  Browse Events
                </Link>
                <Link to="/signup" className="btn btn-outline-primary btn-lg">
                  <span className="me-2">✨</span>
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mt-5 mb-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="stats-card">
              <div className="mb-3" style={{ fontSize: '3rem' }}>🎉</div>
              <div className="stats-number">1000+</div>
              <div className="stats-label">Events Hosted</div>
              <p className="text-muted mt-3 mb-0">
                Discover a wide variety of events happening in your area
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card">
              <div className="mb-3" style={{ fontSize: '3rem' }}>👥</div>
              <div className="stats-number">50K+</div>
              <div className="stats-label">Active Users</div>
              <p className="text-muted mt-3 mb-0">
                Join a thriving community of event enthusiasts
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="stats-card">
              <div className="mb-3" style={{ fontSize: '3rem' }}>⭐</div>
              <div className="stats-number">4.9/5</div>
              <div className="stats-label">User Rating</div>
              <p className="text-muted mt-3 mb-0">
                Trusted by thousands for seamless event management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mt-5 mb-5">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold mb-3">How It Works</h2>
          <p className="lead text-muted">Get started in three simple steps</p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card card-custom text-center p-4">
              <div className="mb-4" style={{ fontSize: '3.5rem' }}>🔍</div>
              <h4 className="fw-bold mb-3">Discover Events</h4>
              <p className="text-muted">
                Browse through a curated list of events tailored to your interests
                and location.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-custom text-center p-4">
              <div className="mb-4" style={{ fontSize: '3.5rem' }}>🎫</div>
              <h4 className="fw-bold mb-3">Register Instantly</h4>
              <p className="text-muted">
                Secure your spot with one click and receive instant confirmation
                with QR codes.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card card-custom text-center p-4">
              <div className="mb-4" style={{ fontSize: '3.5rem' }}>🎊</div>
              <h4 className="fw-bold mb-3">Enjoy & Connect</h4>
              <p className="text-muted">
                Attend amazing events and connect with like-minded people in your
                community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mt-5 mb-5">
        <div className="card card-custom p-5 text-center glass-effect">
          <h2 className="display-6 fw-bold mb-3">Ready to Get Started?</h2>
          <p className="lead text-muted mb-4">
            Join thousands of users who are already discovering and creating amazing
            events.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Create Account
            </Link>
            <Link to="/events" className="btn btn-outline-primary btn-lg">
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}