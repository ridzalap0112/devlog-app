import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="auth-logo-mark">
            <div className="auth-logo-inner" />
          </div>
          <h1 className="auth-title">DevLog</h1>
          <p className="auth-subtitle">Your learning journey starts here</p>
        </div>

        <div className="card">
          <h2 style={{ fontSize:'1.25rem', fontWeight:700, color:'#f1f5f9', marginBottom:'1.5rem' }}>
            Welcome back
          </h2>

          {error && <div className="alert-error" style={{ marginBottom:'1rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" placeholder="you@example.com" className="input-field"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" placeholder="Enter your password" className="input-field"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary w-full"
              style={{ marginTop:'0.5rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', color:'#64748b', fontSize:'0.875rem', marginTop:'1.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="link">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
