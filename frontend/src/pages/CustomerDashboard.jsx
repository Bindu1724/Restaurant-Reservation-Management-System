
import { useEffect, useState } from 'react';
import client from '../api/client';

const SLOTS = ['12:00-14:00','14:00-16:00','18:00-20:00','20:00-22:00'];

export default function CustomerDashboard() {
  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ tableId:'', date:'', timeSlot:SLOTS[0], guests:1 });
  const [my, setMy] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    const t = await client.get('/tables');
    setTables(t.data.filter(x => x.isActive));
    const r = await client.get('/reservations/my');
    setMy(r.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await client.post('/reservations', form);
      setForm({ ...form, date: '' });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create reservation');
    }
  };

  const cancel = async (id) => {
    try { await client.delete(`/reservations/${id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || 'Failed to cancel'); }
  };

  return (
    <div className="container py-4">
      <h3>Customer dashboard</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="row g-3" onSubmit={submit}>
        <div className="col-md-3">
          <label className="form-label">Table</label>
          <select className="form-select" value={form.tableId} onChange={e=>setForm({ ...form, tableId: e.target.value })}>
            <option value="">Select table</option>
            {tables.map(t => <option key={t._id} value={t._id}>{t.name} (cap {t.capacity})</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" value={form.date}
                 onChange={e=>setForm({ ...form, date: e.target.value })}/>
        </div>
        <div className="col-md-3">
          <label className="form-label">Time slot</label>
          <select className="form-select" value={form.timeSlot}
                  onChange={e=>setForm({ ...form, timeSlot: e.target.value })}>
            {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Guests</label>
          <input type="number" min="1" className="form-control" value={form.guests}
                 onChange={e=>setForm({ ...form, guests: Number(e.target.value) })}/>
        </div>
        <div className="col-12"><button className="btn btn-primary">Reserve</button></div>
      </form>

      <hr />
      <h5>My reservations</h5>
      <ul className="list-group">
        {my.map(r => (
          <li key={r._id} className="list-group-item d-flex justify-content-between">
            <span>{r.date} {r.timeSlot} — Table {r.table?.name} — Guests {r.guests} — {r.status}</span>
            {r.status === 'active' && <button className="btn btn-outline-danger btn-sm" onClick={()=>cancel(r._id)}>Cancel</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}