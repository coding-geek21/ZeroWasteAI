import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, Users, ChefHat } from 'lucide-react'

const DIFFICULTY_COLOR = { easy: 'text-green-600', medium: 'text-yellow-600', hard: 'text-red-600' }

export default function RecipeCard({ details }) {
  const [expanded, setExpanded] = useState(false)
  if (!details) return null

  return (
    <div className="mt-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Clock size={14} /> {details.prep_time_minutes ?? '?'} min
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Users size={14} /> {details.servings ?? '?'} servings
        </div>
        <div className={`flex items-center gap-1.5 text-sm font-medium capitalize ${DIFFICULTY_COLOR[details.difficulty] || 'text-gray-600'}`}>
          <ChefHat size={14} /> {details.difficulty ?? 'medium'}
        </div>
      </div>

      {details.ingredients_used?.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">At-risk ingredients used</p>
          <div className="flex flex-wrap gap-1.5">
            {details.ingredients_used.map((ing, i) => (
              <span key={i} className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                {ing.name} {ing.quantity}
              </span>
            ))}
          </div>
        </div>
      )}

      {details.instructions?.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900 transition"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Hide steps' : `View ${details.instructions.length} steps`}
          </button>
          {expanded && (
            <ol className="mt-3 space-y-2">
              {details.instructions.map((step, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  )
}
