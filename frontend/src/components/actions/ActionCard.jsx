import { useState } from 'react'
import { Tag, ChefHat, Heart, Bell, Leaf, CheckCircle, X, ChevronDown } from 'lucide-react'
import RecipeCard from './RecipeCard'
import DiscountSuggestion from './DiscountSuggestion'
import DonationMatcher from './DonationMatcher'
import { acceptAction, completeAction, dismissAction } from '../../services/api'

const TYPE_CONFIG = {
  DISCOUNT: { icon: Tag,      color: 'bg-blue-50 border-blue-200',   badge: 'bg-blue-600 text-white',     label: 'Discount' },
  RECIPE:   { icon: ChefHat,  color: 'bg-amber-50 border-amber-200', badge: 'bg-amber-600 text-white',    label: 'Recipe'   },
  DONATE:   { icon: Heart,    color: 'bg-green-50 border-green-200', badge: 'bg-green-600 text-white',    label: 'Donate'   },
  ALERT:    { icon: Bell,     color: 'bg-red-50 border-red-200',     badge: 'bg-red-600 text-white',      label: 'Alert'    },
  COMPOST:  { icon: Leaf,     color: 'bg-gray-50 border-gray-200',   badge: 'bg-gray-500 text-white',     label: 'Compost'  },
}

const PRIORITY_DOT = { URGENT: 'bg-red-500', HIGH: 'bg-orange-400', MEDIUM: 'bg-yellow-400' }

export default function ActionCard({ action }) {
  const [status, setStatus] = useState(action.status || 'suggested')
  const [loading, setLoading] = useState('')

  const cfg = TYPE_CONFIG[action.type] || TYPE_CONFIG.ALERT
  const Icon = cfg.icon

  const handle = async (fn, next) => {
    setLoading(next)
    try { await fn(action.id) } catch {}
    setStatus(next)
    setLoading('')
  }

  if (status === 'dismissed') return null

  return (
    <div className={`rounded-2xl border p-5 ${cfg.color} transition`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              <Icon size={11} /> {cfg.label}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[action.priority] || 'bg-gray-400'}`} />
            {action.priority}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-gray-900 text-base mb-1">{action.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{action.description}</p>

      {/* Type-specific detail component */}
      {action.type === 'RECIPE'   && status !== 'completed' && <RecipeCard details={action.details} />}
      {action.type === 'DISCOUNT' && status !== 'completed' && <DiscountSuggestion details={action.details} />}
      {action.type === 'DONATE'   && status !== 'completed' && <DonationMatcher details={action.details} />}
      {action.type === 'ALERT'    && action.details?.alert_message && (
        <div className="mt-2 bg-red-100 border border-red-200 rounded-xl px-4 py-2 text-sm text-red-700 font-medium">
          {action.details.alert_message}
        </div>
      )}

      {/* Savings */}
      {action.estimated_savings && (
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
          {action.estimated_savings.money_usd > 0 && <span>💰 \${action.estimated_savings.money_usd} saved</span>}
          <span>🥦 {action.estimated_savings.food_kg}kg food</span>
          <span>🌿 {action.estimated_savings.co2_kg}kg CO₂</span>
          <span>🍽️ {action.estimated_savings.meals_equivalent} meals</span>
        </div>
      )}

      {/* Actions */}
      {status === 'completed' ? (
        <div className="mt-4 flex items-center gap-2 text-green-700 font-medium text-sm">
          <CheckCircle size={16} /> Completed!
        </div>
      ) : (
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => handle(acceptAction, 'accepted')}
            disabled={!!loading}
            className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-700 disabled:opacity-60 transition"
          >
            <CheckCircle size={14} />
            {status === 'accepted' ? 'Mark Done' : 'Accept'}
          </button>
          {status === 'accepted' && (
            <button
              onClick={() => handle(completeAction, 'completed')}
              disabled={!!loading}
              className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-60 transition"
            >
              <CheckCircle size={14} /> Mark Complete
            </button>
          )}
          <button
            onClick={() => handle(dismissAction, 'dismissed')}
            disabled={!!loading}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 px-3 py-2 rounded-xl text-sm transition"
          >
            <X size={14} /> Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
