
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { login } from '../api/auth.js';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   const { loginUser } = useAuth();


  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await login(email, password);
      // ok is { token, user: { id, name, email, role } }
      loginUser({ token: ok.token, role: ok.user.role, name: ok.user.name });
      console.log("Login response:", ok);
      navigate(ok.user.role === 'admin' ? '/admin' : '/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container d-flex vh-100 justify-content-center align-items-center">
      <form className="card p-4 shadow w-100" style={{ maxWidth: '420px' }} onSubmit={submit}>
        <h2 className="mb-3 text-center">Sign In</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
        <div className="text-center mt-3">
        <small>Don't have an account? <Link to="/register">Register</Link></small>
      </div>
      </form>
     </div>
  );
}