const MOOD_CONFIG = {
  great: { label: 'Great', color: '#ea580c', bg: 'rgba(234,88,12,0.1)', border: 'rgba(234,88,12,0.2)' },
  good:  { label: 'Good',  color: '#16a34a', bg: 'rgba(22,163,74,0.1)',  border: 'rgba(22,163,74,0.2)' },
  okay:  { label: 'Okay',  color: '#ca8a04', bg: 'rgba(202,138,4,0.1)',  border: 'rgba(202,138,4,0.2)' },
  bad:   { label: 'Bad',   color: '#dc2626', bg: 'rgba(220,38,38,0.1)',  border: 'rgba(220,38,38,0.2)' },
};

export default function LogCard({ log, onEdit, onDelete }) {
  const mood = MOOD_CONFIG[log.mood] || MOOD_CONFIG.okay;
  const date = new Date(log.created_at).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
  const hours = Math.floor((log.study_minutes || 0) / 60);
  const mins  = (log.study_minutes || 0) % 60;
  const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="log-card">
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem' }}>
        <div style={{ flex:1, minWidth:0 }}>

          {/* Title + mood */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
            <h3 style={{ fontWeight:600, color:'#f1f5f9', fontSize:'1rem', lineHeight:1.4 }}>
              {log.title}
            </h3>
            <span className="mood-badge" style={{
              color: mood.color, backgroundColor: mood.bg, borderColor: mood.border
            }}>
              {mood.label}
            </span>
          </div>

          {/* Content */}
          {log.content && (
            <p style={{ color:'#64748b', fontSize:'0.875rem', lineHeight:1.6,
                        marginBottom:'0.75rem', overflow:'hidden',
                        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
              {log.content}
            </p>
          )}

          {/* Tags */}
          {log.tags && log.tags.length > 0 && (
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.375rem', marginBottom:'0.75rem' }}>
              {log.tags.map(tag => (
                <span key={tag} className="tag-badge">{tag}</span>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="meta-info">
            <span>{date}</span>
            <span>{duration} studied</span>
          </div>
        </div>

        {/* Actions */}
        <div className="log-card-actions">
          <button className="action-btn edit" onClick={onEdit} title="Edit">ED</button>
          <button className="action-btn delete" onClick={onDelete} title="Delete">RM</button>
        </div>
      </div>
    </div>
  );
}
