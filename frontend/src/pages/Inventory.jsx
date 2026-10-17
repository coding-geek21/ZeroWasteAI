import { useState } from 'react'
import { Plus } from 'lucide-react'
import InventoryList from '../components/inventory/InventoryList'
import AddItemForm from '../components/inventory/AddItemForm'

export default function Inventory() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">Track all your food items and their freshness.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 transition font-medium"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      <InventoryList />

      {/* Add Item Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <AddItemForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
