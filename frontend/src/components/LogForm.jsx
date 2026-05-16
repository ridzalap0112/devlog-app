import { useState, useEffect } from 'react';
import { logsAPI } from '../services/api';

const MOODS = [
  { value: 'great', emoji: '🔥', label: 'Great' },
  { value: 'good',  emoji: '😊', label: 'Good' },
  { value: 'okay',  emoji: '😐', label: 'Okay' },
  { value: 'bad',   emoji: '😔', label: 'Bad' },
];

export default function LogForm({ log, onClose }) {
  const isEditing = !!log;
  const [form, setForm] = useState({
    title: '',
    content: '',
    mood: 'good',
    tags: '',
    study_minutes: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (log) {
      setForm({
        title: log.title || '',
        content: log.content || '',
        mood: log.mood || 'good',
        tags: (log.tags || []).join(', '),
        study_minutes: log.study_minutes || 60,
      });
    }
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

      if (isEditing) {
        await logsAPI.update(log.id, data);
      } else {
        await logsAPI.create(data);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? 'Edit Log' : 'New Learning Log'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              What did you learn today? *
            </label>
            <input
              type="text"
              placeholder="e.g. Learned about React hooks"
              className="input-field"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              How was your session?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setForm({ ...form, mood: m.value })}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition-all
                    ${form.mood === m.value
                      ? 'border-brand-500 bg-brand-600/20 text-white'
                      : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                >
                  <div className="text-lg">{m.emoji}</div>
                  <div className="text-xs mt-0.5">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Notes & Details
            </label>
            <textarea
              placeholder="What did you build? What was challenging? What did you discover?"
              className="input-field resize-none"
              rows={4}
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
            />
          </div>

          {/* Tags + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Tags
              </label>
              <input
                type="text"
                placeholder="React, CSS, Git"
                className="input-field"
                value={form.tags}
                onChange={e => setForm({ ...form, tags: e.target.value })}
              />
              <p className="text-xs text-slate-500 mt-1">Comma separated</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Duration (minutes)
              </label>
              <input
                type="number"
                placeholder="60"
                className="input-field"
                min="0"
                value={form.study_minutes}
                onChange={e => setForm({ ...form, study_minutes: e.target.value })}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Log' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
