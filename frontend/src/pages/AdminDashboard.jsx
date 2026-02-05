
import { useEffect, useState } from 'react';
import client from '../api/client';
import { getTables, addTable, updateTable, deleteTable } from '../api/tables';

export default function AdminDashboard() {
  const [date, setDate] = useState('');
  const [items, setItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddTable, setShowAddTable] = useState(false);
  const [editingTableId, setEditingTableId] = useState(null);
  const [formData, setFormData] = useState({ name: '', capacity: '' });

  const load = async () => {
    const qs = date ? `?date=${date}` : '';
    const res = await client.get(`/api/reservations${qs}`);
    setItems(res.data);
    const t = await getTables();
    setTables(t.data);
  };
  useEffect(()=>{ load(); }, [date]);

  const cancel = async (id) => {
    try { await client.delete(`/api/reservations/${id}`); load(); }
    catch (err) { setError(err.response?.data?.message || 'Cancel failed'); }
  };

  const handleAddTableClick = () => {
    setEditingTableId(null);
    setFormData({ name: '', capacity: '' });
    setShowAddTable(true);
  };

  const handleEditTable = (table) => {
    setEditingTableId(table._id);
    setFormData({ name: table.name, capacity: table.capacity });
    setShowAddTable(true);
  };

  const handleSaveTable = async () => {
    try {
      if (!formData.name.trim() || !formData.capacity) {
        setError('Please fill in all fields');
        return;
      }
      
      const capacityNum = parseInt(formData.capacity, 10);
      if (!Number.isInteger(capacityNum) || capacityNum < 1) {
        setError('Capacity must be a valid number of at least 1');
        return;
      }
      
      const tableData = { 
        name: formData.name.trim(), 
        capacity: capacityNum 
      };
      
      if (editingTableId) {
        await updateTable(editingTableId, tableData);
      } else {
        await addTable(tableData);
      }
      
      // Reset form
      setFormData({ name: '', capacity: '' });
      setEditingTableId(null);
      setShowAddTable(false);
      setSuccess('Table saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await load();
    } catch (err) {
      console.error('Error saving table:', err);
      setError(err.response?.data?.message || 'Failed to save table');
    }
  };

  const handleDeleteTable = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await deleteTable(id);
        setError('');
        setSuccess('Table deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
        await load();
      } catch (err) {
        console.error('Delete error:', err);
        setError(err.response?.data?.message || err.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="container py-4">
      <h3>Admin dashboard</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

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
      <button className="btn btn-primary mb-3" onClick={handleAddTableClick}>+ Add Table</button>
      
      {showAddTable && (
        <div className="card mb-3 p-3">
          <h6>{editingTableId ? 'Edit Table' : 'Add New Table'}</h6>
          <div className="row g-2">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Table name (e.g., Table A)"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                min="1"
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-success me-2" onClick={handleSaveTable}>Save</button>
              <button className="btn btn-secondary" onClick={() => setShowAddTable(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>Table Name</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {tables.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.capacity}</td>
                <td>{t.isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEditTable(t)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTable(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}