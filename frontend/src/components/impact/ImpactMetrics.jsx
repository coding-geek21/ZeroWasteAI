import { Leaf, DollarSign, Wind, Heart, TrendingUp } from 'lucide-react'

const metrics = (data) => [
  { label: 'Food Saved',       value: `${data.total_food_saved_kg ?? 0} kg`,   icon: Leaf,        color: 'text-green-600', bg: 'bg-green-50',  trend: '+23% vs last' },
  { label: 'Money Recovered',  value: `$${data.total_money_saved_usd ?? 0}`,   icon: DollarSign,  color: 'text-blue-600',  bg: 'bg-blue-50',   trend: '+18% vs last' },
  { label: 'CO₂ Prevented',   value: `${data.total_co2_prevented_kg ?? 0} kg`, icon: Wind,        color: 'text-teal-600',  bg: 'bg-teal-50',   trend: '= 640 km driven' },
  { label: 'Meals Donated',    value: `${data.total_meals_donated ?? 0}`,       icon: Heart,       color: 'text-red-500',   bg: 'bg-red-50',    trend: 'to 3 food banks' },
]

export default function ImpactMetrics({ data = {} }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics(data).map((m) => (
        <div key={m.label} className={`${m.bg} rounded-2xl p-5 border`}>
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm mb-3 ${m.color}`}>
            <m.icon size={20} />
          </div>
          <p className="text-xs text-gray-500 mb-1">{m.label}</p>
          <p className={`text-2xl font-extrabold ${m.color}`}>{m.value}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-0.5">
            <TrendingUp size={10} /> {m.trend}
          </p>
        </div>
      ))}
    </div>
  )
}
