// StreakCard — menghitung dan menampilkan streak belajar
// Logika: cek apakah ada log hari ini, kemarin, dll secara berurutan

export default function StreakCard({ logs }) {
  // Fungsi untuk format tanggal menjadi string "YYYY-MM-DD"
  const toDateStr = (date) => new Date(date).toISOString().split('T')[0];

  // Kumpulkan semua tanggal unik yang ada log-nya
  const logDates = [...new Set(logs.map(l => toDateStr(l.created_at)))].sort().reverse();

  // Hitung streak
  const calcStreak = () => {
    if (logDates.length === 0) return 0;

    const today = toDateStr(new Date());
    const yesterday = toDateStr(new Date(Date.now() - 86400000));

    // Streak hanya valid kalau ada log hari ini atau kemarin
    if (logDates[0] !== today && logDates[0] !== yesterday) return 0;

    let streak = 1;
    for (let i = 0; i < logDates.length - 1; i++) {
      const current = new Date(logDates[i]);
      const next = new Date(logDates[i + 1]);
      const diffDays = (current - next) / 86400000;
      if (diffDays === 1) { streak++; }
      else { break; }
    }
    return streak;
  };

  const streak = calcStreak();
  const todayHasLog = logDates[0] === toDateStr(new Date());

  // Tampilkan 7 hari terakhir sebagai dot indicator
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return toDateStr(d);
  });

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

        {/* Streak number */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '3.5rem', height: '3.5rem', borderRadius: '1rem',
            backgroundColor: streak > 0 ? 'rgba(234,88,12,0.15)' : '#0f172a',
            border: `1px solid ${streak > 0 ? 'rgba(234,88,12,0.3)' : '#1e293b'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
          }}>
            <span style={{
              fontSize: '1.5rem', fontWeight: 800, lineHeight: 1,
              color: streak > 0 ? '#ea580c' : '#334155',
              fontFamily: 'JetBrains Mono, monospace',
            }}>{streak}</span>
            <span style={{ fontSize: '0.5rem', color: '#64748b', fontWeight: 600, letterSpacing: '0.05em' }}>DAY</span>
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
              {streak === 0 ? 'No streak yet' : `${streak}-day streak`}
            </p>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.125rem' }}>
              {todayHasLog ? 'Logged today — keep it up!' : 'Log today to continue your streak'}
            </p>
          </div>
        </div>

        {/* 7-day dots */}
        <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
          {last7Days.map((day, i) => {
            const hasLog = logDates.includes(day);
            const isToday = day === toDateStr(new Date());
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{
                  width: '0.625rem', height: '0.625rem', borderRadius: '50%',
                  backgroundColor: hasLog ? '#ea580c' : '#1e293b',
                  border: isToday ? '1px solid #3d3df7' : 'none',
                  transition: 'background-color 0.2s',
                }} />
                <span style={{ fontSize: '0.5rem', color: '#334155', fontFamily: 'monospace' }}>
                  {['Su','Mo','Tu','We','Th','Fr','Sa'][new Date(day).getDay()]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
