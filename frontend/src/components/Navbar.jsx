import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar(){
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  let user = null;
  try {
    const raw = localStorage.getItem('user');
    user = raw ? JSON.parse(raw) : null;
  } catch(e) {
    user = null;
  }

  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-bold text-lg">EventSphere</Link>
        </div>

        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Hi, {user.name || user.email}</span>
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
