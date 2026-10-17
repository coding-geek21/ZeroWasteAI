import { AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { formatDaysLeft, formatCurrency } from '../../utils/formatters';
import { getRiskColor } from '../../utils/formatters';
import { acceptAction, dismissAction } from '../../services/api';
import { useQueryClient } from '@tanstack/react-query';

const MOCK_URGENT = [
  {
    id: 'u1',
    itemName: 'Chicken Breast',
    type: 'RECIPE',
    title: 'Use chicken breast today',
    estimatedSavings: 17.0,
    daysLeft: 1,
    risk: 'CRITICAL',
  },
  {
    id: 'u2',
    itemName: 'Salmon Fillet',
    type: 'DONATE',
    title: 'Donate salmon to food bank',
    estimatedSavings: 18.0,
    daysLeft: 0,
    risk: 'CRITICAL',
  },
  {
    id: 'u3',
    itemName: 'Whole Milk',
    type: 'DISCOUNT',
    title: 'Apply 40% discount on milk',
    estimatedSavings: 5.4,
    daysLeft: 2,
    risk: 'HIGH',
  },
];

const TYPE_COLORS = {
  RECIPE: 'blue',
  DONATE: 'purple',
  DISCOUNT: 'orange',
  ALERT: 'red',
};

export function UrgentActions({ actions }) {
  const queryClient = useQueryClient();
  const items = actions?.length ? actions : MOCK_URGENT;

  const handleAccept = async (id) => {
    try {
      await acceptAction(id);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    } catch (_) {}
  };

  const handleDismiss = async (id) => {
    try {
      await dismissAction(id);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } catch (_) {}
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <h3 className="text-base font-semibold text-gray-800">Urgent Actions</h3>
        <span className="ml-auto bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="divide-y divide-gray-50">
        {items.map((action) => (
          <div key={action.id} className="px-5 py-3.5 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <Badge color={TYPE_COLORS[action.type] || 'gray'}>{action.type}</Badge>
                <Badge color={getRiskColor(action.risk)}>{action.risk}</Badge>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate">{action.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {action.itemName} · {formatDaysLeft(action.daysLeft)} left · Save {formatCurrency(action.estimatedSavings)}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button size="sm" variant="primary" onClick={() => handleAccept(action.id)}>
                <Check className="w-3 h-3" />
                Accept
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDismiss(action.id)}>
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-400">
            🎉 No urgent actions right now!
          </div>
        )}
      </div>
    </div>
  );
}

export default UrgentActions;
