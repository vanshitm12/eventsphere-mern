import React from 'react';

export default function Admin(){
  return (
    <div>
      <h2>Admin Panel</h2>
      <p className="text-muted">Admin functionalities to manage events/users.</p>
      <div className="list-group">
        <button className="list-group-item list-group-item-action">Manage Events</button>
        <button className="list-group-item list-group-item-action">Manage Users</button>
      </div>
    </div>
  );
}
