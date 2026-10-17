import { useNavigate } from 'react-router-dom';
import { ScanLine, Plus, BarChart3 } from 'lucide-react';

const actions = [
  {
    label: 'Scan Food',
    description: 'Use camera or upload photo',
    icon: ScanLine,
    to: '/scan',
    bg: 'bg-green-600 hover:bg-green-700',
    iconBg: 'bg-green-500',
  },
  {
    label: 'Add Item',
    description: 'Manually add to inventory',
    icon: Plus,
    to: '/inventory',
    bg: 'bg-blue-600 hover:bg-blue-700',
    iconBg: 'bg-blue-500',
  },
  {
    label: 'Full Report',
    description: 'View impact & savings',
    icon: BarChart3,
    to: '/impact',
    bg: 'bg-purple-600 hover:bg-purple-700',
    iconBg: 'bg-purple-500',
  },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-800 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ label, description, icon: Icon, to, bg, iconBg }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className={`${bg} text-white rounded-xl p-4 text-left transition-all duration-150 hover:shadow-md active:scale-95`}
          >
            <div className={`w-9 h-9 ${iconBg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-xs opacity-80 mt-0.5">{description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickActions;
