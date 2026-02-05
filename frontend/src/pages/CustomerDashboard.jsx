
import { useEffect, useState } from 'react';
import client from '../api/client';
import { createReservation, getMyReservations } from '../api/reservations.js';
import { useAuth } from '../context/AuthContext.jsx';

const SLOTS = ['12:00-14:00','14:00-16:00','18:00-20:00','20:00-22:00'];

export default function CustomerDashboard() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableId:'', date:'', timeSlot:SLOTS[0], guests:1 });
  const [myReservations, setMyReservations] = useState([]);
  const [error, setError] = useState('');

  const { user } = useAuth();

  const load = async () => {
    if (!user) {
      // clear any previous data when not logged in and avoid unauthorized requests
      setTables([]);
      setMyReservations([]);
      return;
    }

    // Always fetch tables (admins and customers should see tables)
    try {
      setError('');
      const t = await client.get('/api/tables');
      setTables(t.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tables');
      return;
    }

    // Only customers have "my reservations" endpoint
    if (user.role === 'customer') {
      try {
        const r = await getMyReservations();
        setMyReservations(r.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load reservations');
      }
    } else {
      setMyReservations([]);
    }
  };
  useEffect(() => { load(); }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!user) { setError('Please sign in to make a reservation'); return; }
    setError('');
    try {
      await createReservation(form);
      // reset all form fields to initial state after successful reservation
      setForm({ tableId: '', date: '', timeSlot: SLOTS[0], guests: 1 });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    }
  };

  const cancel = async (id) => {
    try { await client.delete(`/api/reservations/${id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to cancel'); }
  };

  return (
    <div className="container py-4">
      <h3>Customer dashboard</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {!user && <div className="alert alert-info">Please log in to view and reserve tables.</div>}
      <form className="row g-3" onSubmit={submit}>
        <div className="col-md-3">
          <label className="form-label">Table</label>
          <select className="form-select" value={form.tableId} onChange={e=>setForm({ ...form, tableId: e.target.value })} disabled={!user}>
            <option value="">Select table</option>
            {tables.map(t => <option key={t._id} value={t._id}>{t.name} (cap {t.capacity})</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" value={form.date}
                 onChange={e=>setForm({ ...form, date: e.target.value })} disabled={!user}/>
        </div>
        <div className="col-md-3">
          <label className="form-label">Time slot</label>
          <select className="form-select" value={form.timeSlot}
                  onChange={e=>setForm({ ...form, timeSlot: e.target.value })} disabled={!user}>
            {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Guests</label>
          <input type="number" min="1" className="form-control" value={form.guests}
                 onChange={e=>setForm({ ...form, guests: Number(e.target.value) })} disabled={!user}/>
        </div>
        <div className="col-12"><button className="btn btn-primary" disabled={!user}>Reserve</button></div>
      </form>

      <hr />
      <h5>My reservations</h5>
      <ul className="list-group">
        {myReservations.map(r => (
          <li key={r._id} className="list-group-item d-flex justify-content-between">
            <span>Date: <span className="badge bg-primary">{r.date}</span> — Time: <span className="badge bg-primary">{r.timeSlot}</span> — Table: <span className="badge bg-primary">{r.table?.name}</span> — Guests: <span className="badge bg-primary">{r.guests}</span> — Status: <span className={r.status === 'active' ? 'badge bg-success' : 'badge bg-danger'}>{r.status}</span></span>
            {r.status === 'active' && <button className="btn btn-outline-danger btn-sm" onClick={()=>cancel(r._id)}>Cancel</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}