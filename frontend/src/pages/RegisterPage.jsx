import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api/auth';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiRegister({ name, email, password });
      setLoading(false);
      // Redirect to login with success message
      nav('/login', { state: { registered: true } });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h3 className="mb-3">Create an account</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="vstack gap-3">
        <input className="form-control" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
      </form>
    </div>
  );
}