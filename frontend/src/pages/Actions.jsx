import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getActions } from '../services/api'
import ActionCard from '../components/actions/ActionCard'
import { Zap } from 'lucide-react'

const TABS = ['All', 'DISCOUNT', 'RECIPE', 'DONATE', 'ALERT']

const MOCK_ACTIONS = [
  { id: 'a1', type: 'DISCOUNT', priority: 'URGENT', title: '30% Off Salmon Today', description: 'Apply a discount to sell through 2.5kg salmon before it expires tomorrow.', target_items: ['item001'], details: { suggested_discount_percent: 30, original_price: 18.0, new_price: 12.6 }, estimated_savings: { money_usd: 12.6, food_kg: 2.5, co2_kg: 67.5, meals_equivalent: 10 }, status: 'suggested' },
  { id: 'a2', type: 'RECIPE', priority: 'HIGH', title: 'Spinach & Mushroom Risotto', description: 'Uses 3 at-risk items together: spinach, mushrooms, and parmesan.', target_items: ['item002', 'item005'], details: { recipe_name: 'Spinach & Mushroom Risotto', prep_time_minutes: 30, servings: 4, difficulty: 'medium' }, estimated_savings: { money_usd: 8.0, food_kg: 1.2, co2_kg: 2.4, meals_equivalent: 4 }, status: 'suggested' },
  { id: 'a3', type: 'DONATE', priority: 'HIGH', title: 'Donate Surplus Bread Rolls', description: 'Donate 12 units of bread rolls to City Food Bank — 2km away, high need.', target_items: ['item007'], details: { suitable_quantity: '12 units', food_bank_match: 'City Food Bank', pickup_deadline: 'Today by 5pm' }, estimated_savings: { money_usd: 0, food_kg: 2.4, co2_kg: 3.4, meals_equivalent: 9 }, status: 'suggested' },
  { id: 'a4', type: 'ALERT', priority: 'URGENT', title: 'Use Baby Spinach Today', description: 'Spinach is at 45% freshness and expires tomorrow — use in any dish immediately.', target_items: ['item002'], details: { alert_message: 'Baby spinach must be used today.', deadline: 'Today' }, estimated_savings: { money_usd: 4.0, food_kg: 0.5, co2_kg: 1.0, meals_equivalent: 2 }, status: 'suggested' },
]

export default function Actions() {
  const [activeTab, setActiveTab] = useState('All')
  const { data, isLoading } = useQuery({
    queryKey: ['actions'],
    queryFn: () => getActions(),
    initialData: { actions: MOCK_ACTIONS },
  })

  const actions = data?.actions || []
  const filtered = activeTab === 'All' ? actions : actions.filter(a => a.type === activeTab)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
        <p className="text-gray-500 mt-1">Smart actions to prevent food waste before it happens.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab}
            {tab !== 'All' && (
              <span className="ml-1.5 text-xs opacity-70">
                ({actions.filter(a => a.type === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Zap size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No {activeTab.toLowerCase()} actions right now</p>
          <p className="text-sm mt-1">Check back after scanning your inventory</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(action => <ActionCard key={action.id} action={action} />)}
        </div>
      )}
    </div>
  )
}
