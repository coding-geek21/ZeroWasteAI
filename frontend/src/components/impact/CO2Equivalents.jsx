import { Car, TreePine, Zap } from 'lucide-react'

export default function CO2Equivalents({ co2_kg = 0 }) {
  const km_driven   = Math.round(co2_kg * 4.1)
  const trees       = Math.round(co2_kg * 0.05)
  const phone_days  = Math.round(co2_kg * 122)   // ~8.2g CO2 per phone charge

  const equivalents = [
    { icon: Car,      label: 'km of driving avoided',  value: km_driven,  color: 'text-blue-600',  bg: 'bg-blue-50'  },
    { icon: TreePine, label: 'trees worth of CO₂',     value: trees,      color: 'text-green-600', bg: 'bg-green-50' },
    { icon: Zap,      label: 'phone charges equivalent',value: phone_days, color: 'text-yellow-600',bg: 'bg-yellow-50'},
  ]

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">
        Your <span className="text-green-600">{co2_kg} kg CO₂</span> prevention equals…
      </h2>
      <div className="grid grid-cols-3 gap-4">
        {equivalents.map((e) => (
          <div key={e.label} className={`${e.bg} rounded-xl p-4 text-center`}>
            <e.icon size={22} className={`mx-auto mb-2 ${e.color}`} />
            <p className={`text-xl font-extrabold ${e.color}`}>{e.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1 leading-snug">{e.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
