import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  Package,
  Zap,
  Heart,
  BarChart3,
  Settings,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/scan', icon: ScanLine, label: 'Scan' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/actions', icon: Zap, label: 'Actions' },
  { to: '/donate', icon: Heart, label: 'Donate' },
  { to: '/impact', icon: BarChart3, label: 'Impact' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-4 px-3 shrink-0 h-full overflow-y-auto scrollbar-thin">
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-700',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={['w-4.5 h-4.5', isActive ? 'text-green-600' : 'text-gray-400'].join(' ')}
                  size={18}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom branding */}
      <div className="mt-4 pt-4 border-t border-gray-100 px-3">
        <p className="text-xs text-gray-400 text-center">ZeroWaste AI v1.0</p>
        <p className="text-xs text-green-600 text-center mt-0.5">🌿 Saving the planet</p>
      </div>
    </aside>
  );
}

export default Sidebar;
