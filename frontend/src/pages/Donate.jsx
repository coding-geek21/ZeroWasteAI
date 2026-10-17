import { useQuery } from '@tanstack/react-query'
import { getFoodBanks } from '../services/api'
import DonationMatcher from '../components/actions/DonationMatcher'
import { Heart } from 'lucide-react'

const MOCK_BANKS = [
  { id: 'fb001', name: 'City Food Bank', address: '123 Main Street, City Center', distance_km: 1.8, accepted_categories: ['produce', 'bakery', 'dairy', 'canned'], operating_hours: 'Mon-Fri 9am-5pm, Sat 10am-2pm', contact_phone: '+1-555-0101', current_need: 'HIGH' },
  { id: 'fb002', name: 'Hope Kitchen', address: '45 Elm Avenue, Westside', distance_km: 3.2, accepted_categories: ['produce', 'meat', 'bakery'], operating_hours: 'Daily 8am-6pm', contact_phone: '+1-555-0102', current_need: 'HIGH' },
  { id: 'fb003', name: 'Community Pantry', address: '789 Oak Street, Northgate', distance_km: 5.1, accepted_categories: ['canned', 'frozen', 'dairy'], operating_hours: 'Tue-Sat 10am-4pm', contact_phone: '+1-555-0103', current_need: 'MEDIUM' },
]

export default function Donate() {
  const { data, isLoading } = useQuery({
    queryKey: ['food-banks'],
    queryFn: () => getFoodBanks(40.7128, -74.006, 10),
    initialData: MOCK_BANKS,
  })

  const banks = Array.isArray(data) ? data : MOCK_BANKS

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Donation Center</h1>
        <p className="text-gray-500 mt-1">Match surplus food with nearby food banks in need.</p>
      </div>

      {/* Impact Banner */}
      <div className="bg-green-600 text-white rounded-2xl p-6 flex items-center gap-4">
        <Heart size={36} className="flex-shrink-0 opacity-80" />
        <div>
          <p className="font-bold text-lg">Every donation matters</p>
          <p className="text-green-100 text-sm">1 kg of donated food = ~4 meals for someone in need. Your surplus is someone else's dinner.</p>
        </div>
      </div>

      {/* Food Banks */}
      <h2 className="text-lg font-semibold text-gray-800">Nearby Food Banks</h2>
      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {banks.map(bank => <DonationMatcher key={bank.id} bank={bank} />)}
        </div>
      )}
    </div>
  )
}
