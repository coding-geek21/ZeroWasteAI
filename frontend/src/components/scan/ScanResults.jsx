import { useState, useEffect } from 'react';
import { Pencil, Trash2, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { formatDaysLeft, getFreshnessColor } from '../../utils/formatters';
import { CATEGORY_ICONS } from '../../utils/constants';

export function ScanResults({ items: initialItems, results, onAddAll, onReset, loading }) {
  const sourceItems = initialItems || results?.items || [];
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (sourceItems && sourceItems.length > 0) {
      setItems(
        sourceItems.map((item) => ({
          ...item,
          freshness_score: item.freshness_score ?? item.freshnessScore ?? 75,
          freshnessScore: item.freshness_score ?? item.freshnessScore ?? 75,
          estimated_days_left: item.estimated_days_left ?? item.daysLeft ?? 4,
          daysLeft: item.estimated_days_left ?? item.daysLeft ?? 4,
          waste_risk: item.waste_risk ?? item.risk ?? 'LOW',
          risk: item.waste_risk ?? item.risk ?? 'LOW',
        }))
      );
    } else {
      setItems([]);
    }
  }, [initialItems, results]);

  const [editId, setEditId] = useState(null);

  const handleRemove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border p-8 space-y-4">
        <p className="text-sm font-medium text-gray-600">No food items detected in this image.</p>
        <p className="text-xs text-gray-400">Make sure items are clearly visible and well lit.</p>
        {onReset && (
          <Button variant="secondary" size="sm" onClick={onReset} className="mx-auto mt-2">
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Try Another Photo
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-2xl border shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-gray-800">{items.length} Food Item(s) Detected</h3>
          <p className="text-xs text-gray-500">Review items below before saving to inventory</p>
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Retake
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={() => onAddAll?.(items)}
            loading={loading}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Add All to Inventory
          </Button>
        </div>
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
                      onClick={() => handleRemove(idx)}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Remove item"
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

export default ScanResults;
