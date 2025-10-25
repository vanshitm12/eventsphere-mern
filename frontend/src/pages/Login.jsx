import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', { email, password: pass });

      if (!response.data.token) throw new Error("Token missing from server!");

      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (setUser) setUser(response.data.user);
      }

      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 fade-in" style={{ maxWidth: '500px' }}>
      <div className="card card-custom p-5 border-0 shadow-xl">
        <div className="text-center mb-4">
          <div className="mb-3">
            <span style={{ fontSize: '3rem' }}>👋</span>
          </div>
          <h2 className="fw-bold mb-2">Welcome Back</h2>
          <p className="text-muted">Login to your EventSphere account</p>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-4">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-decoration-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 btn-lg mb-3" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              <>
                <span className="me-2">🚀</span>
                Login
              </>
            )}
          </button>

          <div className="text-center">
            <p className="text-muted mb-0">
              Don't have an account?{' '}
              <Link to="/signup" className="text-decoration-none fw-bold">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}