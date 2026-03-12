import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Syringe,
  CreditCard,
  Box,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { RootState } from '@/store';
import api from '@/web-configs/api';

interface DashboardStats {
  waitScreening: number;
  waitInjection: number;
  completedToday: number;
  waitPayment: number;
  lowStock: number;
}

interface BusinessAlert {
  type: 'Critical' | 'Warning' | 'Success' | 'Info';
  msg: string;
  time: string;
}

const DashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    waitScreening: 0,
    waitInjection: 0,
    completedToday: 0,
    waitPayment: 0,
    lowStock: 0
  });
  const [alerts, setAlerts] = useState<BusinessAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          api.get('/util/dashboard-stats'),
          api.get('/util/business-alerts')
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (alertsRes.data.success) {
          setAlerts(alertsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: t('waiting_screening'),
      value: stats.waitScreening,
      icon: <Users className="text-blue-400" size={24} />,
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/30',
      path: '/screening',
      info: t('waiting_screening_info')
    },
    {
      title: t('waiting_injection'),
      value: stats.waitInjection,
      icon: <Syringe className="text-emerald-400" size={24} />,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30',
      path: '/injection',
      info: t('waiting_injection_info')
    },
    {
      title: t('waiting_payment'),
      value: stats.waitPayment,
      icon: <CreditCard className="text-amber-400" size={24} />,
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30',
      path: '/payment',
      info: t('waiting_payment_info')
    },
    {
      title: t('low_stock'),
      value: stats.lowStock,
      icon: <Box className="text-rose-400" size={24} />,
      color: 'from-rose-500/20 to-red-500/20',
      borderColor: 'border-rose-500/30',
      path: '/inventory',
      info: t('low_stock_info')
    },
    {
      title: t('completed_today'),
      value: stats.completedToday,
      icon: <CheckCircle2 className="text-indigo-400" size={24} />,
      color: 'from-indigo-500/20 to-purple-500/20',
      borderColor: 'border-indigo-500/30',
      path: '/screening',
      info: t('completed_today_info')
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{t('dashboard')}</h1>
          <p className="text-gray-400 mt-2 flex items-center">
            <Activity size={16} className="mr-2 text-green-500" />
            {t('welcome')}, <span className="text-white font-medium ml-1">{user?.fullName}</span>. {t('system_stable')}
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-gray-500 text-sm uppercase tracking-widest">{t('real_time')}</p>
          <p className="text-white font-mono text-lg">{new Date().toLocaleTimeString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className={`group relative overflow-hidden bg-dark-card border ${card.borderColor} p-6 rounded-[2.5rem] cursor-pointer transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-white/10 active:scale-95`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-30 group-hover:opacity-50 transition-opacity`} />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-4 bg-gray-900/80 backdrop-blur-md rounded-3xl shadow-inner border border-white/5">
                  {card.icon}
                </div>
                <div className="flex flex-col items-end">
                  <ArrowUpRight size={20} className="text-gray-600 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  <Clock size={14} className="mt-2 text-gray-700" />
                </div>
              </div>

              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">{card.title}</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-4xl font-bold text-white tracking-tighter">
                  {loading ? '...' : card.value}
                </p>
                <span className="text-gray-600 text-xs lowercase">{t('unit_process')}</span>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <p className="text-[11px] text-gray-500 italic">{card.info}</p>
                <div className="flex h-1.5 w-12 bg-gray-800 rounded-full overflow-hidden">
                  <div className="bg-white/20 w-1/2 group-hover:w-full transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-dark-card border border-gray-800/50 p-8 rounded-[3rem] shadow-xl">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full mr-3" />
            {t('alerts')}
          </h2>
          <div className="space-y-4">
            {alerts.map((note, i) => (
              <div key={i} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gray-800/30 transition-colors">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${note.type === 'Critical' ? 'bg-red-500' :
                  note.type === 'Warning' ? 'bg-orange-500' :
                    note.type === 'Success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{note.msg}</p>
                  <p className="text-[11px] text-gray-600 mt-1 uppercase tracking-tighter">{note.time}</p>
                </div>
              </div>
            ))}
            {!loading && alerts.length === 0 && (
              <p className="text-gray-500 text-sm italic p-4 text-center">{t('no_alerts')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
