import { Tag } from 'lucide-react'

export default function DiscountSuggestion({ details }) {
  if (!details) return null
  const { suggested_discount_percent, original_price, new_price, expected_sell_through } = details

  return (
    <div className="mt-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">New price</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-700">\${new_price?.toFixed(2)}</span>
            <span className="text-sm text-gray-400 line-through">\${original_price?.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            <Tag size={12} /> {suggested_discount_percent}% OFF
          </span>
          {expected_sell_through && (
            <p className="text-xs text-gray-500">
              ~{Math.round(expected_sell_through * 100)}% expected sell-through
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
