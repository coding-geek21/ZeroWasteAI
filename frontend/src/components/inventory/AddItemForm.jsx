import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useAddItems } from '../../hooks/useInventory'

const CATEGORIES = ['produce', 'dairy', 'meat', 'bakery', 'frozen', 'canned', 'beverage', 'other']
const UNITS = ['kg', 'lbs', 'units', 'liters']

const DEFAULT_FORM = {
  name: '',
  category: 'produce',
  quantity: '',
  unit: 'kg',
  expiry_date: '',
  cost_per_unit: '',
}

export default function AddItemForm({ onClose }) {
  const addItems = useAddItems()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [error, setError] = useState('')

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.quantity) {
      setError('Name and quantity are required.')
      return
    }
    const payload = {
      name: form.name.trim(),
      category: form.category,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      source: 'manual',
      ...(form.expiry_date && { expiry_date: new Date(form.expiry_date).toISOString() }),
      ...(form.cost_per_unit && { cost_per_unit: parseFloat(form.cost_per_unit) }),
    }
    try {
      await addItems.mutateAsync([payload])
      onClose()
    } catch (err) {
      setError(err?.detail || err?.message || 'Failed to add item. Please try again.')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Add Food Item</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Food Name *</label>
          <input
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g. Roma Tomatoes"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={form.category}
            onChange={e => update('category', e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 capitalize focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>
        </div>

        {/* Quantity + Unit */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number" min="0" step="0.1"
              value={form.quantity}
              onChange={e => update('quantity', e.target.value)}
              placeholder="0.0"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={form.unit}
              onChange={e => update('unit', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {UNITS.map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>

        {/* Expiry + Cost */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={e => update('expiry_date', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost per unit ($)</label>
            <input
              type="number" min="0" step="0.01"
              value={form.cost_per_unit}
              onChange={e => update('cost_per_unit', e.target.value)}
              placeholder="0.00"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={addItems.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-60 transition">
            <Plus size={16} />
            {addItems.isPending ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  )
}
