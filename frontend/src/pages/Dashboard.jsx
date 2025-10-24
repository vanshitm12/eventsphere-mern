import React from 'react';

export default function Dashboard(){
  return (
    <div>
      <h2>Dashboard</h2>
      <p className="text-muted">Your upcoming events and statistics will appear here.</p>
      <div className="row">
        <div className="col-md-4"><div className="p-3 bg-white card-custom">Total Events<br/><strong>—</strong></div></div>
        <div className="col-md-4"><div className="p-3 bg-white card-custom">Registered<br/><strong>—</strong></div></div>
        <div className="col-md-4"><div className="p-3 bg-white card-custom">Revenue<br/><strong>—</strong></div></div>
      </div>
    </div>
  );
}
