import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing(){
  return (
    <div className="text-center">
      <h1 className="display-5 fw-bold">Discover events near you</h1>
      <p className="lead text-muted">Join, manage and create events effortlessly with EventSphere.</p>
      <div className="mt-4">
        <Link to="/events" className="btn btn-primary btn-lg me-2">Browse Events</Link>
        <Link to="/signup" className="btn btn-outline-secondary btn-lg">Create account</Link>
      </div>
    </div>
  );
}
