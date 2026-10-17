import { MapPin, Phone, Clock, Heart } from 'lucide-react'

const NEED_STYLES = {
  HIGH:   'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW:    'bg-green-100 text-green-700',
}

export default function DonationMatcher({ bank, details }) {
  // Accept either a full bank object (from Donate page) or action details
  const data = bank || details
  if (!data) return null

  const needLevel = data.current_need || 'MEDIUM'

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{data.name || data.food_bank_match}</h3>
          {data.distance_km && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={12} /> {data.distance_km} km away
            </p>
          )}
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${NEED_STYLES[needLevel]}`}>
          Need: {needLevel}
        </span>
      </div>

      {data.address && (
        <p className="text-sm text-gray-500 mb-2">{data.address}</p>
      )}

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        {data.operating_hours && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> {data.operating_hours}
          </span>
        )}
        {data.contact_phone && (
          <span className="flex items-center gap-1">
            <Phone size={12} /> {data.contact_phone}
          </span>
        )}
      </div>

      {data.accepted_categories?.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1">Accepts:</p>
          <div className="flex flex-wrap gap-1">
            {data.accepted_categories.map(cat => (
              <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full capitalize">
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.pickup_deadline && (
        <p className="text-sm text-orange-600 font-medium mb-3">
          Pickup deadline: {data.pickup_deadline}
        </p>
      )}

      <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm">
        <Heart size={15} /> Schedule Donation
      </button>
    </div>
  )
}
