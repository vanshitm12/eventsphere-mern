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

  // ✅ Load user from localStorage on mount
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
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container">
          <Link className="navbar-brand" to="/">EventSphere</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navmenu">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/events">Events</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/dashboard">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
              {!user ? (
                <li className="nav-item">
                  <Link className="btn btn-outline-primary ms-2" to="/login">Login</Link>
                </li>
              ) : (
                <li className="nav-item d-flex align-items-center ms-2">
                  <span className="me-2 text-muted small">Hi, {user.name || user.email}</span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('user');
                      setUser(null);
                    }}
                  >
                    Logout
                  </button>
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
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <footer className="footer text-center py-3">
        <div className="container">
          <small>© {new Date().getFullYear()} EventSphere</small>
        </div>
      </footer>
    </>
  );
}