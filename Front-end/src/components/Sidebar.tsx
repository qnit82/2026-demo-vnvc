import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  Users,
  Syringe,
  Stethoscope,
  CreditCard,
  Package,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { logout } from '@/store/authSlice';
import { RootState, AppDispatch } from '@/store';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: t('dashboard') },
    { path: '/customers', icon: <Users size={20} />, label: t('customers') },
    { path: '/screening', icon: <Stethoscope size={20} />, label: t('screening') },
    { path: '/payment', icon: <CreditCard size={20} />, label: t('payment') },
    { path: '/injection', icon: <Syringe size={20} />, label: t('injection') },
    { path: '/inventory', icon: <Package size={20} />, label: t('inventory') },
    { path: '/reports', icon: <BarChart3 size={20} />, label: t('reports') },
  ];

  return (
    <aside
      className={`${isOpen ? 'w-64' : 'w-20'
        } bg-dark-card border-r border-gray-800 transition-all duration-300 flex flex-col h-screen sticky top-0`}
    >
      {/* Logo & Toggle */}
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-dark-primary rounded-lg flex items-center justify-center font-bold text-white">V</div>
            <span className="text-xl font-bold text-white tracking-wider">DEMO_APP</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center text-indigo-400 font-bold">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-3 py-3 rounded-xl transition-all group
              ${isActive
                ? 'bg-dark-primary text-white shadow-lg shadow-indigo-500/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }
            `}
          >
            <div className={`${!isOpen && 'mx-auto'}`}>{item.icon}</div>
            {isOpen && (
              <>
                <span className="ml-3 font-medium flex-1">{item.label}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => dispatch(logout())}
          className="w-full flex items-center px-3 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
        >
          <LogOut size={20} className={`${!isOpen && 'mx-auto'}`} />
          {isOpen && <span className="ml-3 font-medium">{t('logout')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
