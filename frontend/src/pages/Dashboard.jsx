import { useQuery } from '@tanstack/react-query'
import { Package, AlertTriangle, DollarSign, Wind } from 'lucide-react'
import { getDashboard } from '../services/api'
import StatCard from '../components/dashboard/StatCard'
import WasteTrendChart from '../components/dashboard/WasteTrendChart'
import UrgentActions from '../components/dashboard/UrgentActions'
import QuickActions from '../components/dashboard/QuickActions'
import { useAuth } from '../hooks/useAuth'

const MOCK_DASHBOARD = {
  inventory_count: 47,
  items_at_risk: 8,
  today_savings: { money: 124, food_kg: 12, co2_kg: 42 },
  actions_pending: 3,
  weekly_trend: [
    { date: 'Mon', waste_kg: 4, saved_kg: 8 },
    { date: 'Tue', waste_kg: 2, saved_kg: 10 },
    { date: 'Wed', waste_kg: 5, saved_kg: 7 },
    { date: 'Thu', waste_kg: 1, saved_kg: 12 },
    { date: 'Fri', waste_kg: 3, saved_kg: 9 },
    { date: 'Sat', waste_kg: 2, saved_kg: 11 },
    { date: 'Sun', waste_kg: 1, saved_kg: 14 },
  ],
}

export default function Dashboard() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: getDashboard,
    initialData: MOCK_DASHBOARD,
  })

  const stats = [
    { title: 'Items in Stock', value: data.inventory_count, icon: Package, color: 'blue', trend: '+3 today' },
    { title: 'Items at Risk', value: data.items_at_risk, icon: AlertTriangle, color: 'red', trend: 'needs attention' },
    { title: 'Saved This Week', value: `$${data.today_savings.money}`, icon: DollarSign, color: 'green', trend: '↑ 18% vs last' },
    { title: 'CO₂ Prevented', value: `${data.today_savings.co2_kg}kg`, icon: Wind, color: 'teal', trend: '= 172 km driven' },
  ]

  const name = user?.displayName?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{greeting}, {name}!</h1>
        <p className="text-gray-500 mt-1">Here's your food status today.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Urgent Actions */}
        <div className="lg:col-span-2">
          <UrgentActions />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Waste Trend — Last 7 Days</h2>
        <WasteTrendChart data={data.weekly_trend} />
      </div>
    </div>
  )
}
