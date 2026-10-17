export default function FreshnessIndicator({ score }) {
  const pct = Math.max(0, Math.min(100, score))
  const color = pct >= 70 ? 'bg-green-500' : pct >= 40 ? 'bg-yellow-400' : 'bg-red-500'
  const label = pct >= 70 ? 'Fresh' : pct >= 40 ? 'Aging' : 'Critical'
  const textColor = pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">Freshness</span>
        <span className={`font-semibold ${textColor}`}>{pct}% — {label}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
