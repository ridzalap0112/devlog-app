const MOOD_CONFIG = {
  great: { emoji: '🔥', label: 'Great', color: 'text-orange-400 bg-orange-400/10 border-orange-400/20' },
  good:  { emoji: '😊', label: 'Good',  color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  okay:  { emoji: '😐', label: 'Okay',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  bad:   { emoji: '😔', label: 'Bad',   color: 'text-red-400 bg-red-400/10 border-red-400/20' },
};

export default function LogCard({ log, onEdit, onDelete }) {
  const mood = MOOD_CONFIG[log.mood] || MOOD_CONFIG.okay;
  const date = new Date(log.created_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
  const hours = Math.floor((log.study_minutes || 0) / 60);
  const mins = (log.study_minutes || 0) % 60;
  const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="card group hover:border-brand-800/50 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title + mood */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="font-semibold text-white text-lg leading-snug">
              {log.title}
            </h3>
            <span className={`mood-badge border ${mood.color}`}>
              {mood.emoji} {mood.label}
            </span>
          </div>

          {/* Content preview */}
          {log.content && (
            <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
              {log.content}
            </p>
          )}

          {/* Tags */}
          {log.tags && log.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {log.tags.map(tag => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>📅 {date}</span>
            <span>⏱ {duration} studied</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400
                       hover:text-white transition-all"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400
                       transition-all"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
