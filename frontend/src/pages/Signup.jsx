import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validatePassword = () => {
    if (pass.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (pass !== confirmPass) {
      return 'Passwords do not match';
    }
    return '';
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);
    
    try {
      await API.post('/auth/signup', { name, email, password: pass });
      alert('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!pass) return { strength: 0, label: '', color: '' };
    if (pass.length < 6) return { strength: 25, label: 'Weak', color: 'danger' };
    if (pass.length < 10) return { strength: 50, label: 'Fair', color: 'warning' };
    if (pass.length < 14) return { strength: 75, label: 'Good', color: 'info' };
    return { strength: 100, label: 'Strong', color: 'success' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="row justify-content-center fade-in">
      <div className="col-md-6 col-lg-5">
        <div className="card card-custom p-5 border-0">
          <div className="text-center mb-4">
            <div className="mb-3">
              <span style={{ fontSize: '3rem' }}>🎉</span>
            </div>
            <h2 className="fw-bold mb-2">Create Account</h2>
            <p className="text-muted">Join EventSphere today</p>
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
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

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
              <label className="form-label">Password</label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Create a strong password"
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
              {pass && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">Password strength:</small>
                    <small className={`text-${passwordStrength.color} fw-bold`}>
                      {passwordStrength.label}
                    </small>
                  </div>
                  <div className="progress" style={{ height: '4px' }}>
                    <div 
                      className={`progress-bar bg-${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Confirm your password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                required
                disabled={loading}
              />
              {confirmPass && pass !== confirmPass && (
                <small className="text-danger">Passwords do not match</small>
              )}
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="terms" required />
                <label className="form-check-label small" htmlFor="terms">
                  I agree to the{' '}
                  <a href="#" className="text-decoration-none">Terms of Service</a> and{' '}
                  <a href="#" className="text-decoration-none">Privacy Policy</a>
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
                  Creating account...
                </>
              ) : (
                '✨ Create Account'
              )}
            </button>

            <div className="text-center">
              <p className="text-muted mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-decoration-none fw-bold">
                  Login
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-4">
            <div className="text-center mb-3">
              <small className="text-muted">Or sign up with</small>
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
      </div>
    </div>
  );
}