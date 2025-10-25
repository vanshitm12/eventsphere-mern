import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Signup from './pages/Signup';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setUser(storedUser);
    } catch {
      console.warn('Error reading user from localStorage');
    }
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            EventSphere
          </Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navmenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navmenu">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link className="nav-link" to="/events">Events</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">Dashboard</Link>
              </li>
              {user?.role === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              )}
              {!user ? (
                <li className="nav-item ms-lg-2">
                  <Link className="btn btn-primary" to="/login">
                    <span className="me-1">🚀</span>
                    Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item ms-lg-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="text-end me-2 d-none d-lg-block">
                      <small className="text-muted d-block">Welcome back</small>
                      <small className="fw-bold">{user.name || user.email}</small>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-5">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail user={user} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/create" element={<Admin />} />
          <Route path="/admin/edit/:id" element={<Admin />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4 mb-3 mb-md-0">
              <h5 className="fw-bold mb-3">EventSphere</h5>
              <p className="text-muted small">
                Discover and create amazing events in your community.
              </p>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <h6 className="fw-bold mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li><Link to="/events" className="text-muted text-decoration-none small">Browse Events</Link></li>
                <li><Link to="/dashboard" className="text-muted text-decoration-none small">My Dashboard</Link></li>
                <li><Link to="/signup" className="text-muted text-decoration-none small">Sign Up</Link></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="fw-bold mb-3">Connect</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-decoration-none" style={{ fontSize: '1.5rem' }}>📘</a>
                <a href="#" className="text-decoration-none" style={{ fontSize: '1.5rem' }}>🐦</a>
                <a href="#" className="text-decoration-none" style={{ fontSize: '1.5rem' }}>📷</a>
                <a href="#" className="text-decoration-none" style={{ fontSize: '1.5rem' }}>💼</a>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center">
            <small className="text-muted">
              © {new Date().getFullYear()} EventSphere. All rights reserved.
            </small>
          </div>
        </div>
      </footer>
    </>
  );
}