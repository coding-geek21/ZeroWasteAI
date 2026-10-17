import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const MOCK_DATA = [
  { day: 'Mon', saved: 4.2, wasted: 1.8 },
  { day: 'Tue', saved: 6.1, wasted: 0.9 },
  { day: 'Wed', saved: 3.5, wasted: 2.5 },
  { day: 'Thu', saved: 7.3, wasted: 0.7 },
  { day: 'Fri', saved: 5.8, wasted: 1.2 },
  { day: 'Sat', saved: 9.2, wasted: 0.5 },
  { day: 'Sun', saved: 6.4, wasted: 1.1 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3">
        <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <strong>{entry.value} kg</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function WasteTrendChart({ data }) {
  const chartData = data || MOCK_DATA;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800">Waste Trend (Last 7 Days)</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-green-500 rounded-full inline-block" />
            <span className="text-gray-500">Saved</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-red-400 rounded-full inline-block" />
            <span className="text-gray-500">Wasted</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} unit=" kg" />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="saved"
            stroke="#16a34a"
            strokeWidth={2.5}
            dot={{ fill: '#16a34a', r: 3 }}
            activeDot={{ r: 5 }}
            name="Saved"
          />
          <Line
            type="monotone"
            dataKey="wasted"
            stroke="#f87171"
            strokeWidth={2.5}
            dot={{ fill: '#f87171', r: 3 }}
            activeDot={{ r: 5 }}
            name="Wasted"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WasteTrendChart;
