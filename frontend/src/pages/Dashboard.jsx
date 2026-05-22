import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logsAPI } from '../services/api';
import LogCard from '../components/LogCard';
import LogForm from '../components/LogForm';
import StreakCard from '../components/StreakCard';
import WeeklyChart from '../components/WeeklyChart';

const MOOD_FILTER = ['all', 'great', 'good', 'okay', 'bad'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [moodFilter, setMoodFilter] = useState('all');

  const fetchLogs = async () => {
    try {
      const res = await logsAPI.getAll();
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleDelete = async (id) => {
    if (!confirm('Delete this log?')) return;
    await logsAPI.delete(id);
    setLogs(logs.filter(l => l.id !== id));
  };
  const handleEdit = (log) => { setEditingLog(log); setShowForm(true); };
  const handleFormClose = () => { setShowForm(false); setEditingLog(null); fetchLogs(); };

  const filteredLogs = moodFilter === 'all' ? logs : logs.filter(l => l.mood === moodFilter);
  const totalMinutes = logs.reduce((sum, l) => sum + (l.study_minutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const moodCounts = logs.reduce((acc, l) => { acc[l.mood] = (acc[l.mood] || 0) + 1; return acc; }, {});
  const thisWeek = logs.filter(l => {
    const diff = (new Date() - new Date(l.created_at)) / (1000*60*60*24);
    return diff <= 7;
  }).length;

  const stats = [
    { label: 'Total Logs',    value: logs.length,              accent: '#3d3df7' },
    { label: 'Hours Studied', value: `${totalHours}h`,         accent: '#0d9488' },
    { label: 'Great Days',    value: moodCounts['great'] || 0, accent: '#ea580c' },
    { label: 'This Week',     value: thisWeek,                 accent: '#7c3aed' },
  ];

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand">
            <div className="navbar-logo">
              <div className="navbar-logo-mark" />
            </div>
            <span className="navbar-title">DevLog</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <span style={{ color:'#64748b', fontSize:'0.875rem' }}>{user?.name}</span>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding:'0.4rem 1rem' }}>
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Stats */}
        <div className="stats-grid animate-slide-up">
          {stats.map(({ label, value, accent }) => (
            <div key={label} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: accent + '20', color: accent }}>
                {label.slice(0,2).toUpperCase()}
              </div>
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Streak + Chart — hanya tampil kalau ada logs */}
        {!loading && logs.length > 0 && (
          <div className="animate-slide-up">
            <StreakCard logs={logs} />
            <WeeklyChart logs={logs} />
          </div>
        )}

        {/* Header */}
        <div className="section-header">
          <h2 className="section-title">My Learning Logs</h2>
          <button onClick={() => { setEditingLog(null); setShowForm(true); }} className="btn-primary">
            + New Log
          </button>
        </div>

        {/* Filters */}
        <div className="filter-row">
          {MOOD_FILTER.map(mood => (
            <button key={mood} onClick={() => setMoodFilter(mood)}
              className={`filter-tab ${moodFilter === mood ? 'active' : ''}`}>
              {mood}
            </button>
          ))}
        </div>

        {/* Logs */}
        {loading ? (
          <div style={{ textAlign:'center', padding:'5rem 0', color:'#64748b' }}>
            <div className="spinner animate-spin" />
            <p>Loading your logs...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <div className="empty-icon-lines">
                <div className="empty-icon-line" />
                <div className="empty-icon-line" />
                <div className="empty-icon-line" />
              </div>
            </div>
            <p className="empty-title">No logs yet</p>
            <p className="empty-sub">Start documenting your learning journey</p>
            <button onClick={() => setShowForm(true)} className="btn-primary"
              style={{ marginTop:'1.5rem' }}>
              Write your first log
            </button>
          </div>
        ) : (
          <div className="log-list animate-slide-up">
            {filteredLogs.map(log => (
              <LogCard key={log.id} log={log}
                onEdit={() => handleEdit(log)}
                onDelete={() => handleDelete(log.id)} />
            ))}
          </div>
        )}
      </div>

      {showForm && <LogForm log={editingLog} onClose={handleFormClose} />}
    </div>
  );
}
