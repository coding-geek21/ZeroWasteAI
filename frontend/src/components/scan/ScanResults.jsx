import { useState } from 'react';
import { Pencil, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { formatDaysLeft, getFreshnessColor } from '../../utils/formatters';
import { CATEGORY_ICONS } from '../../utils/constants';

export function ScanResults({ items: initialItems, onAddAll, loading }) {
  const [items, setItems] = useState(initialItems || []);
  const [editId, setEditId] = useState(null);

  const handleRemove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
    setEditId(null);
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-sm">No items detected. Try scanning again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{items.length} item(s) detected</h3>
        <Button
          variant="primary"
          size="md"
          onClick={() => onAddAll?.(items)}
          loading={loading}
        >
          <CheckCircle className="w-4 h-4" />
          Add All to Inventory
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Item</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Qty</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Freshness</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Expires</th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">Risk</th>
              <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {items.map((item, idx) => (
              <tr key={idx} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CATEGORY_ICONS[item.category] || '📦'}</span>
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-3 w-36">
                  <div className="flex items-center gap-2">
                    <Progress value={item.freshnessScore ?? 0} color="auto" className="flex-1" />
                    <span className={`text-xs font-medium ${getFreshnessColor(item.freshnessScore)}`}>
                      {item.freshnessScore ?? 0}%
                    </span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-xs font-medium ${getFreshnessColor(item.freshnessScore)}`}>
                  {formatDaysLeft(item.daysLeft)}
                </td>
                <td className="px-4 py-3">
                  <Badge color={item.risk === 'HIGH' || item.risk === 'CRITICAL' ? 'red' : item.risk === 'MEDIUM' ? 'yellow' : 'green'}>
                    {item.risk || 'LOW'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setEditId(editId === idx ? null : idx)}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
