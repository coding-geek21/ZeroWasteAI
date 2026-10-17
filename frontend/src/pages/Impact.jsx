import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getImpact } from '../services/api'
import ImpactMetrics from '../components/impact/ImpactMetrics'
import SavingsChart from '../components/impact/SavingsChart'
import CO2Equivalents from '../components/impact/CO2Equivalents'
import BadgeGrid from '../components/impact/BadgeGrid'
import { Download, Award } from 'lucide-react'

const PERIODS = ['week', 'month', 'year']

const MOCK_IMPACT = {
  total_food_saved_kg: 234,
  total_money_saved_usd: 1847,
  total_co2_prevented_kg: 156,
  total_meals_donated: 89,
  trend: [
    { date: 'Week 1', value: 200 }, { date: 'Week 2', value: 380 },
    { date: 'Week 3', value: 610 }, { date: 'Week 4', value: 950 },
    { date: 'Week 5', value: 1200 }, { date: 'Week 6', value: 1560 },
    { date: 'Week 7', value: 1847 },
  ],
  badges: [
    { id: 'first_scan', name: 'First Scan', earned: true },
    { id: '10kg_saved', name: 'Food Saver', earned: true },
    { id: 'first_donation', name: 'Community Hero', earned: true },
    { id: 'zero_waste_week', name: 'Zero Waste Week', earned: false },
    { id: '50_meals', name: 'Hunger Fighter', earned: false },
    { id: '100_co2', name: 'Climate Champion', earned: false },
    { id: 'recipe_master', name: 'Recipe Master', earned: false },
  ],
}

export default function Impact() {
  const [period, setPeriod] = useState('month')
  const { data } = useQuery({
    queryKey: ['impact', period],
    queryFn: () => getImpact(period),
    initialData: MOCK_IMPACT,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Impact</h1>
          <p className="text-green-600 font-medium mt-1">You're in the Top 15% of waste reducers!</p>
        </div>
        <div className="flex items-center gap-2">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                period === p ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <ImpactMetrics data={data} />

      {/* CO2 Context */}
      <CO2Equivalents co2_kg={data.total_co2_prevented_kg} />

      {/* Savings Chart */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Money Saved Over Time</h2>
        <SavingsChart data={data.trend} />
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award size={20} className="text-yellow-500" />
          <h2 className="text-lg font-semibold text-gray-800">Achievements</h2>
        </div>
        <BadgeGrid badges={data.badges} />
      </div>

      {/* Download Report */}
      <button className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition">
        <Download size={18} /> Download Impact Report (PDF)
      </button>
    </div>
  )
}
