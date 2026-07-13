import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Shirt, PackagePlus } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Paneli', icon: LayoutDashboard, end: true },
  { to: '/artikuj', label: 'Artikuj', icon: Shirt, end: false },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Shirt size={18} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Fabrika e Prodhimit</p>
          <p className="text-xs text-slate-400">Karta Teknologjike</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-3 pb-5">
        <NavLink
          to="/artikuj/ri"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <PackagePlus size={18} />
          Artikull i Ri
        </NavLink>
      </div>
    </aside>
  );
}
