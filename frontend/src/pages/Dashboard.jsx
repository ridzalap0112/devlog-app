import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logsAPI } from '../services/api';
import LogCard from '../components/LogCard';
import LogForm from '../components/LogForm';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this log?')) return;
    await logsAPI.delete(id);
    setLogs(logs.filter(l => l.id !== id));
  };

  const handleEdit = (log) => {
    setEditingLog(log);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingLog(null);
    fetchLogs();
  };

  const filteredLogs = moodFilter === 'all'
    ? logs
    : logs.filter(l => l.mood === moodFilter);

  // Stats
  const totalMinutes = logs.reduce((sum, l) => sum + (l.study_minutes || 0), 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const moodCounts = logs.reduce((acc, l) => {
    acc[l.mood] = (acc[l.mood] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
              <span className="text-lg">📓</span>
            </div>
            <span className="font-bold text-white text-lg">DevLog</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm hidden sm:block">
              Hey, <span className="text-white font-medium">{user?.name}</span> 👋
            </span>
            <button onClick={handleLogout} className="btn-secondary text-sm py-2 px-4">
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {[
            { label: 'Total Logs', value: logs.length, icon: '📝' },
            { label: 'Hours Studied', value: `${totalHours}h`, icon: '⏱️' },
            { label: 'Great Days', value: moodCounts['great'] || 0, icon: '🔥' },
            { label: 'This Week', value: logs.filter(l => {
              const d = new Date(l.created_at);
              const now = new Date();
              const diff = (now - d) / (1000 * 60 * 60 * 24);
              return diff <= 7;
            }).length, icon: '📅' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="card text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Header + New Log button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">My Learning Logs</h2>
          <button
            onClick={() => { setEditingLog(null); setShowForm(true); }}
            className="btn-primary text-sm"
          >
            + New Log
          </button>
        </div>

        {/* Mood Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {MOOD_FILTER.map(mood => (
            <button
              key={mood}
              onClick={() => setMoodFilter(mood)}
              className={`px-4 py-1.5 rounded-xl text-sm font-medium capitalize transition-all
                ${moodFilter === mood
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
            >
              {mood}
            </button>
          ))}
        </div>

        {/* Logs */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading your logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-400 text-lg">No logs yet.</p>
            <p className="text-slate-500 text-sm mt-1">Start documenting your learning journey!</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary mt-6"
            >
              Write your first log
            </button>
          </div>
        ) : (
          <div className="grid gap-4 animate-slide-up">
            {filteredLogs.map(log => (
              <LogCard
                key={log.id}
                log={log}
                onEdit={() => handleEdit(log)}
                onDelete={() => handleDelete(log.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <LogForm
          log={editingLog}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
