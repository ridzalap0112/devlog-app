import { useState, useEffect } from 'react';
import { logsAPI } from '../services/api';

const MOODS = [
  { value: 'great', label: 'Great' },
  { value: 'good',  label: 'Good'  },
  { value: 'okay',  label: 'Okay'  },
  { value: 'bad',   label: 'Bad'   },
];

export default function LogForm({ log, onClose }) {
  const isEditing = !!log;
  const [form, setForm] = useState({ title:'', content:'', mood:'good', tags:'', study_minutes:60 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (log) setForm({
      title: log.title || '',
      content: log.content || '',
      mood: log.mood || 'good',
      tags: (log.tags || []).join(', '),
      study_minutes: log.study_minutes || 60,
    });
  }, [log]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        title: form.title,
        content: form.content,
        mood: form.mood,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        study_minutes: parseInt(form.study_minutes) || 0,
      };
      if (isEditing) { await logsAPI.update(log.id, data); }
      else { await logsAPI.create(data); }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 style={{ fontSize:'1.0625rem', fontWeight:700, color:'#f1f5f9' }}>
            {isEditing ? 'Edit Log' : 'New Learning Log'}
          </h2>
          <button className="modal-close" onClick={onClose}>X</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="alert-error">{error}</div>}

          <div className="form-group">
            <label className="form-label">What did you learn today? *</label>
            <input type="text" placeholder="e.g. Learned about React hooks" className="input-field"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>

          <div className="form-group">
            <label className="form-label">How was your session?</label>
            <div className="mood-grid">
              {MOODS.map(m => (
                <button key={m.value} type="button"
                  className={`mood-option ${form.mood === m.value ? 'selected' : ''}`}
                  onClick={() => setForm({ ...form, mood: m.value })}>
                  <div style={{ fontSize:'0.6875rem', fontWeight:700, color: form.mood === m.value ? '#a4b9ff' : '#94a3b8',
                                fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.05em' }}>
                    {m.value.toUpperCase().slice(0,2)}
                  </div>
                  <div className="mood-option-label">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Details</label>
            <textarea placeholder="What did you build? What was challenging?"
              className="input-field" rows={4} style={{ resize:'none' }}
              value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input type="text" placeholder="React, CSS, Git" className="input-field"
                value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
              <span className="form-hint">Comma separated</span>
            </div>
            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input type="number" placeholder="60" className="input-field" min="0"
                value={form.study_minutes} onChange={e => setForm({ ...form, study_minutes: e.target.value })} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Log' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
