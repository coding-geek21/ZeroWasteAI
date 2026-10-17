import { useState } from 'react'
import { Trash2, Edit2, Package } from 'lucide-react'
import FreshnessIndicator from './FreshnessIndicator'
import { useDeleteItem } from '../../hooks/useInventory'
import { formatDaysLeft } from '../../utils/formatters'

const RISK_STYLES = {
  HIGH:   'bg-red-100 text-red-700 border-red-200',
  MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  LOW:    'bg-green-100 text-green-700 border-green-200',
}

const CATEGORY_COLORS = {
  produce:  'bg-green-50 text-green-700',
  dairy:    'bg-blue-50 text-blue-700',
  meat:     'bg-red-50 text-red-700',
  bakery:   'bg-amber-50 text-amber-700',
  frozen:   'bg-cyan-50 text-cyan-700',
  canned:   'bg-gray-50 text-gray-700',
  beverage: 'bg-purple-50 text-purple-700',
  other:    'bg-gray-50 text-gray-600',
}

export default function InventoryItem({ item }) {
  const deleteItem = useDeleteItem()
  const [confirming, setConfirming] = useState(false)

  const handleDelete = () => {
    if (confirming) {
      deleteItem.mutate(item.id)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  const risk = item.waste_risk || 'LOW'
  const catColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${catColor}`}>
              {item.category}
            </span>
            <span className="text-xs text-gray-500">
              {item.quantity} {item.unit}
            </span>
          </div>
        </div>

        {/* Risk Badge */}
        <span className={`text-xs font-bold px-2 py-1 rounded-lg border flex-shrink-0 ${RISK_STYLES[risk]}`}>
          {risk}
        </span>
      </div>

      {/* Freshness Bar */}
      <div className="mb-3">
        <FreshnessIndicator score={item.freshness_score ?? 75} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${
          (item.estimated_days_left ?? 5) <= 1 ? 'text-red-600' :
          (item.estimated_days_left ?? 5) <= 3 ? 'text-yellow-600' : 'text-gray-500'
        }`}>
          {formatDaysLeft(item.estimated_days_left ?? 5)}
        </span>

        <div className="flex items-center gap-2">
          {item.cost_per_unit && (
            <span className="text-xs text-gray-400">
              \${item.cost_per_unit}/{item.unit}
            </span>
          )}
          <button
            onClick={handleDelete}
            className={`p-1.5 rounded-lg transition ${
              confirming
                ? 'bg-red-500 text-white'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
            title={confirming ? 'Click again to confirm' : 'Delete item'}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
