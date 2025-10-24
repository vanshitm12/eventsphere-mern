import React, { useEffect, useState } from 'react';
import API from '../api/api';
import { Link } from 'react-router-dom';

function EventCard({ e }){
  return (
    <div className="card card-custom mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={e.imageURL || ('https://picsum.photos/seed/'+e._id+'/600/400')} alt="" className="img-fluid rounded-start" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{e.title}</h5>
            <p className="card-text text-muted">{new Date(e.date).toLocaleString()}</p>
            <p className="card-text">{e.description?.slice(0,150)}</p>
            <Link to={`/events/${e._id}`} className="stretched-link">View details →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Events(){
  const [events,setEvents] = useState([]);
  const [q,setQ] = useState('');
  useEffect(()=>{ API.get('/events').then(r=>setEvents(r.data)).catch(()=>{}); },[]);
  const filtered = events.filter(e => !q || e.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2>All Events</h2>
        <input placeholder="Search events..." value={q} onChange={e=>setQ(e.target.value)} className="form-control w-50" />
      </div>
      <div>
        {filtered.map(e => <EventCard key={e._id} e={e} />)}
        {filtered.length === 0 && <p className="text-muted">No events found.</p>}
      </div>
    </div>
  );
}
