import { useState } from 'react'
import { Search, Filter, Package } from 'lucide-react'
import { useInventoryList } from '../../hooks/useInventory'
import InventoryItem from './InventoryItem'

const RISK_OPTIONS = ['All', 'HIGH', 'MEDIUM', 'LOW']
const CATEGORY_OPTIONS = ['All', 'produce', 'dairy', 'meat', 'bakery', 'frozen', 'canned', 'beverage', 'other']
const SORT_OPTIONS = [
  { value: 'expiry', label: 'Expiry (soonest)' },
  { value: 'freshness', label: 'Freshness (lowest)' },
  { value: 'name', label: 'Name (A-Z)' },
]

const MOCK_ITEMS = [
  { id: 'item001', name: 'Fresh Salmon Fillets', category: 'meat',    quantity: 2.5, unit: 'kg',    freshness_score: 65, estimated_days_left: 2, waste_risk: 'HIGH',   cost_per_unit: 18.0, status: 'active' },
  { id: 'item002', name: 'Baby Spinach',         category: 'produce', quantity: 0.5, unit: 'kg',    freshness_score: 45, estimated_days_left: 1, waste_risk: 'HIGH',   cost_per_unit: 4.0,  status: 'active' },
  { id: 'item003', name: 'Greek Yogurt',         category: 'dairy',   quantity: 3,   unit: 'units', freshness_score: 85, estimated_days_left: 8, waste_risk: 'LOW',    cost_per_unit: 3.5,  status: 'active' },
  { id: 'item004', name: 'Whole Tomatoes',       category: 'produce', quantity: 1.2, unit: 'kg',    freshness_score: 72, estimated_days_left: 4, waste_risk: 'MEDIUM', cost_per_unit: 2.5,  status: 'active' },
  { id: 'item005', name: 'Mushrooms',            category: 'produce', quantity: 0.3, unit: 'kg',    freshness_score: 60, estimated_days_left: 3, waste_risk: 'MEDIUM', cost_per_unit: 5.0,  status: 'active' },
  { id: 'item006', name: 'Cheddar Cheese',       category: 'dairy',   quantity: 0.4, unit: 'kg',    freshness_score: 90, estimated_days_left: 14,waste_risk: 'LOW',    cost_per_unit: 12.0, status: 'active' },
  { id: 'item007', name: 'Bread Rolls',          category: 'bakery',  quantity: 24,  unit: 'units', freshness_score: 70, estimated_days_left: 3, waste_risk: 'MEDIUM', cost_per_unit: 0.5,  status: 'active' },
  { id: 'item008', name: 'Whole Milk',           category: 'dairy',   quantity: 2,   unit: 'liters',freshness_score: 80, estimated_days_left: 5, waste_risk: 'LOW',    cost_per_unit: 1.8,  status: 'active' },
]

export default function InventoryList() {
  const [search, setSearch] = useState('')
  const [risk, setRisk] = useState('All')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('expiry')

  const { data, isLoading } = useInventoryList({ risk, category, sort })
  const rawItems = Array.isArray(data) ? data : (data?.items || [])
  const items = rawItems.length > 0 ? rawItems : (isLoading ? [] : rawItems)

  const filtered = items
    .filter(item => risk === 'All' || item.waste_risk === risk)
    .filter(item => category === 'All' || item.category === category)
    .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'expiry')    return (a.estimated_days_left ?? 99) - (b.estimated_days_left ?? 99)
      if (sort === 'freshness') return (a.freshness_score ?? 100) - (b.freshness_score ?? 100)
      if (sort === 'name')      return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={risk}
            onChange={e => setRisk(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {RISK_OPTIONS.map(o => <option key={o}>{o}</option>)}
          </select>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 capitalize focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {CATEGORY_OPTIONS.map(o => <option key={o} className="capitalize">{o}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <span className="text-xs text-gray-400 self-center ml-auto">{filtered.length} items</span>
        </div>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-40 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Package size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">No items found</p>
          <p className="text-sm mt-1">Try adjusting your filters or add items via scanning</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => <InventoryItem key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}
