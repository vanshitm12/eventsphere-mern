import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-sky-600">EventSphere</Link>
          <Link to="/events" className="text-sm text-slate-600">Events</Link>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-700">Hi, {user.name}</span>
              <Link to="/dashboard" className="text-sm text-slate-600">Dashboard</Link>
              {user.role === 'admin' && <Link to="/admin" className="text-sm text-slate-600">Admin</Link>}
              <button onClick={logout} className="ml-2 btn bg-rose-500 text-white">Logout</button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className="text-sm text-slate-600">Login</Link>
              <Link to="/signup" className="btn bg-sky-600 text-white">Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
