import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Save, User, Bell, Shield } from 'lucide-react'

const BIZ_TYPES = ['restaurant', 'grocery', 'household', 'food_bank']

export default function Settings() {
  const { user, logout } = useAuth()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    displayName: user?.displayName || 'Demo User',
    businessName: 'My Restaurant',
    businessType: 'restaurant',
    wasteThreshold: 2,
    donationRadius: 10,
    notificationsEnabled: true,
  })

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-800">Profile</h2>
          </div>
          {[
            { label: 'Display Name', key: 'displayName', type: 'text' },
            { label: 'Business Name', key: 'businessName', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => update(key, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
            <select
              value={form.businessType}
              onChange={e => update('businessType', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 capitalize"
            >
              {BIZ_TYPES.map(t => <option key={t} value={t} className="capitalize">{t.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={18} className="text-green-600" />
            <h2 className="font-semibold text-gray-800">Alert Preferences</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alert me when items expire within <span className="text-green-600 font-bold">{form.wasteThreshold} days</span>
            </label>
            <input
              type="range" min="1" max="7"
              value={form.wasteThreshold}
              onChange={e => update('wasteThreshold', Number(e.target.value))}
              className="w-full accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1 day</span><span>7 days</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Donation search radius: <span className="text-green-600 font-bold">{form.donationRadius} km</span>
            </label>
            <input
              type="range" min="1" max="50"
              value={form.donationRadius}
              onChange={e => update('donationRadius', Number(e.target.value))}
              className="w-full accent-green-600"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 text-sm">Push Notifications</p>
              <p className="text-xs text-gray-400">Get alerts for expiring items</p>
            </div>
            <button
              type="button"
              onClick={() => update('notificationsEnabled', !form.notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition ${form.notificationsEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
            >
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            <Save size={16} /> {saved ? 'Saved!' : 'Save Settings'}
          </button>
          <button
            type="button"
            onClick={logout}
            className="px-6 py-3 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  )
}
