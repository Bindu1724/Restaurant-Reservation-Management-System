
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { login } from '../api/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('alice@demo.com');
  const [password, setPassword] = useState('CustomerPass123');
  const [error, setError] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  const { loginUser } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await login(email, password);
      loginUser(data);
      nav(data.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 480 }}>
      <h3 className="mb-3">Sign in</h3>
      {location.state?.registered && <div className="alert alert-success">Account created. Please log in.</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={submit} className="vstack gap-3">
        <input className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-control" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <div className="text-center mt-3">
        <small>Don't have an account? <Link to="/register">Register</Link></small>
      </div>
    </div>
  );
}