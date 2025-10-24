import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await API.post('/auth/login', { email, password: pass });
      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (setUser) setUser(response.data.user);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center fade-in">
      <div className="col-md-6 col-lg-5">
        <div className="card card-custom p-5 border-0">
          <div className="text-center mb-4">
            <div className="mb-3">
              <span style={{ fontSize: '3rem' }}>🎭</span>
            </div>
            <h2 className="fw-bold mb-2">Welcome Back</h2>
            <p className="text-muted">Login to access your account</p>
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
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0">Password</label>
                <a href="#" className="text-decoration-none small">Forgot?</a>
              </div>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="remember" />
                <label className="form-check-label small" htmlFor="remember">
                  Remember me for 30 days
                </label>
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
                '🚀 Login'
              )}
            </button>

            <div className="text-center">
              <p className="text-muted mb-0">
                Don't have an account?{' '}
                <Link to="/signup" className="text-decoration-none fw-bold">
                  Sign up
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-4">
            <div className="text-center mb-3">
              <small className="text-muted">Or continue with</small>
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-secondary">
                🔵 Continue with Google
              </button>
              <button className="btn btn-outline-secondary">
                📘 Continue with Facebook
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted small">
            By logging in, you agree to our{' '}
            <a href="#" className="text-decoration-none">Terms of Service</a> and{' '}
            <a href="#" className="text-decoration-none">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}