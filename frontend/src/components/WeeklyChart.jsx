// WeeklyChart — grafik bar jam belajar 7 hari terakhir
// Menggunakan Recharts library

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';

// Custom tooltip yang muncul saat hover bar
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const minutes = payload[0].value;
    const hours = Math.floor(minutes / 60);
    const mins  = minutes % 60;
    const dur   = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    return (
      <div style={{
        backgroundColor: '#0f172a', border: '1px solid #1e293b',
        borderRadius: '0.75rem', padding: '0.75rem 1rem',
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.9375rem' }}>{dur}</p>
      </div>
    );
  }
  return null;
};

export default function WeeklyChart({ logs }) {
  // Buat data 7 hari terakhir
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][date.getDay()];

    // Jumlahkan semua study_minutes pada hari ini
    const totalMinutes = logs
      .filter(l => l.created_at.split('T')[0] === dateStr)
      .reduce((sum, l) => sum + (l.study_minutes || 0), 0);

    return { day: dayName, minutes: totalMinutes, date: dateStr };
  });

  const hasData = chartData.some(d => d.minutes > 0);

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '1rem' }}>
          Weekly Progress
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'JetBrains Mono, monospace' }}>
          Last 7 days
        </span>
      </div>

      {!hasData ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#334155' }}>
          <p style={{ fontSize: '0.875rem' }}>No study data this week yet.</p>
          <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem', color: '#1e293b' }}>
            Add logs with study duration to see your chart.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f172a" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => v === 0 ? '' : `${Math.floor(v/60)}h`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(61,61,247,0.06)' }} />
            <Bar
              dataKey="minutes"
              fill="#3d3df7"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
