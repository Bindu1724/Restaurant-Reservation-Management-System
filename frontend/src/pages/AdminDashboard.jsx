
import { useEffect, useState } from 'react';
import client from '../api/client';

export default function AdminDashboard() {
  const [date, setDate] = useState('');
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    const qs = date ? `?date=${date}` : '';
    const res = await client.get(`/reservations${qs}`);
    setItems(res.data);
    const t = await client.get('/tables');
    setTables(t.data);
  };
  useEffect(()=>{ load(); }, [date]);

  const cancel = async (id) => {
    try { await client.delete(`/reservations/${id}`); load(); }
    catch (err) { setError(err.response?.data?.message || 'Cancel failed'); }
  };

  return (
    <div className="container py-4">
      <h3>Admin dashboard</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 align-items-end">
        <div className="col-md-3">
          <label className="form-label">Filter date</label>
          <input type="date" className="form-control" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <div className="col-md-3">
          <button className="btn btn-secondary" onClick={()=>setDate('')}>Clear</button>
        </div>
      </div>

      <hr />
      <h5>Reservations</h5>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>Date</th><th>Slot</th><th>Table</th><th>Guests</th><th>Customer</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(r => (
              <tr key={r._id}>
                <td>{r.date}</td>
                <td>{r.timeSlot}</td>
                <td>{r.table?.name}</td>
                <td>{r.guests}</td>
                <td>{r.customer?.name}</td>
                <td>{r.status}</td>
                <td>
                  {r.status === 'active' && <button className="btn btn-sm btn-outline-danger" onClick={()=>cancel(r._id)}>Cancel</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr />
      <h5>Tables</h5>
      <ul className="list-group">
        {tables.map(t => (
          <li key={t._id} className="list-group-item d-flex justify-content-between">
            <span>{t.name} — capacity {t.capacity} — {t.isActive ? 'Active' : 'Inactive'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}