import { Star, Leaf, Heart, Calendar, Users, Wind, ChefHat, Lock } from 'lucide-react'

const BADGE_ICONS = {
  first_scan:       Leaf,
  '10kg_saved':     Star,
  first_donation:   Heart,
  zero_waste_week:  Calendar,
  '50_meals':       Users,
  '100_co2':        Wind,
  recipe_master:    ChefHat,
}

const BADGE_DESC = {
  first_scan:       'Complete your first food scan',
  '10kg_saved':     'Save 10 kg of food from waste',
  first_donation:   'Complete your first food donation',
  zero_waste_week:  'Zero food wasted for 7 days straight',
  '50_meals':       'Donate the equivalent of 50 meals',
  '100_co2':        'Prevent 100 kg of CO₂ emissions',
  recipe_master:    'Use 10 AI-suggested recipes',
}

export default function BadgeGrid({ badges = [] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((badge) => {
        const Icon = BADGE_ICONS[badge.id] || Star
        return (
          <div
            key={badge.id}
            className={`relative rounded-2xl border p-4 text-center transition ${
              badge.earned
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-100 opacity-60'
            }`}
          >
            {!badge.earned && (
              <Lock size={12} className="absolute top-2 right-2 text-gray-400" />
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${
              badge.earned ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              <Icon size={22} className="text-white" />
            </div>
            <p className={`text-sm font-bold ${badge.earned ? 'text-gray-900' : 'text-gray-400'}`}>
              {badge.name}
            </p>
            <p className="text-xs text-gray-400 mt-1 leading-snug">
              {BADGE_DESC[badge.id] || ''}
            </p>
            {badge.earned && (
              <span className="inline-block mt-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                Earned!
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
