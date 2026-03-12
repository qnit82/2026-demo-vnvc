import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  Users,
  Syringe,
  AlertTriangle,
  Calendar,
  Activity,
  BarChart2,
  PieChart,
  ArrowRight,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import util from '@/web-configs/util';
import { ReportOverview, RevenueChartPoint, TopVaccineUsage, FunnelData } from '@/types';
import api from '@/web-configs/api';

const ReportPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0], // Last 7 days
    endDate: new Date().toISOString().split('T')[0]
  });

  const [overview, setOverview] = useState<ReportOverview>({
    totalRevenue: 0,
    totalVisits: 0,
    totalInjections: 0,
    adverseReactionRate: 0
  });

  const [revenueChart, setRevenueChart] = useState<RevenueChartPoint[]>([]);
  const [topVaccines, setTopVaccines] = useState<TopVaccineUsage[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData>({
    registered: 0,
    screened: 0,
    paid: 0,
    injected: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };

      const [overviewRes, chartRes, topRes, funnelRes] = await Promise.all([
        api.get('/report/overview', { params }),
        api.get('/report/revenue-chart', { params }),
        api.get('/report/top-vaccines', { params }),
        api.get('/report/funnel', { params })
      ]);

      if (overviewRes.data.success) setOverview(overviewRes.data.data);
      if (chartRes.data.success) setRevenueChart(chartRes.data.data);
      if (topRes.data.success) setTopVaccines(topRes.data.data);
      if (funnelRes.data.success) setFunnelData(funnelRes.data.data);

    } catch (error) {
      console.error('Report data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const maxRevenue = Math.max(...revenueChart.map(d => d.amount), 1); // tránh chia cho 0

  return (
    <div className="max-w-[1600px] mx-auto pb-10 px-4 text-white">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl text-white flex items-center">
            <BarChart2 className="mr-3 text-dark-primary" size={28} />
            {t('report_title')}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{t('report_subtitle')}</p>
        </div>

        <div className="flex items-center space-x-4 bg-dark-card border border-gray-800 p-2 rounded-xl">
          <div className="flex items-center px-3 border-r border-gray-800">
            <Calendar size={16} className="text-gray-500 mr-2" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="bg-transparent text-sm text-gray-300 outline-none"
            />
          </div>
          <div className="flex items-center px-3 pr-4">
            <span className="text-gray-500 mr-2">-</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="bg-transparent text-sm text-gray-300 outline-none"
            />
          </div>
          <button
            onClick={fetchData}
            className="p-2 bg-dark-primary/20 text-dark-primary hover:bg-dark-primary hover:text-white rounded-lg transition-colors"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="animate-spin text-dark-primary" size={48} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Overview KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Doanh thu */}
            <div className="bg-dark-card border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10 text-white">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{t('total_revenue')}</p>
                  <h3 className="text-3xl text-white">{util.formatVND(overview.totalRevenue)}</h3>
                </div>
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>

            {/* Lượt khách */}
            <div className="bg-dark-card border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10 text-white">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{t('total_visits')}</p>
                  <h3 className="text-3xl text-white">{overview.totalVisits} <span className="text-sm font-normal text-gray-500">{t('visits_unit')}</span></h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                  <Users size={24} />
                </div>
              </div>
            </div>

            {/* Số mũi tiêm */}
            <div className="bg-dark-card border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-green-500/10 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10 text-white">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{t('total_injections')}</p>
                  <h3 className="text-3xl text-white">{overview.totalInjections} <span className="text-sm font-normal text-gray-500">{t('injections_unit')}</span></h3>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
                  <Syringe size={24} />
                </div>
              </div>
            </div>

            {/* Tỉ lệ phản ứng */}
            <div className="bg-dark-card border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors"></div>
              <div className="flex justify-between items-start relative z-10 text-white">
                <div>
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">{t('adverse_rate')}</p>
                  <h3 className="text-3xl text-white">{overview.adverseReactionRate}%</h3>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                  <AlertTriangle size={24} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2. Biểu đồ doanh thu */}
            <div className="lg:col-span-2 bg-dark-card border border-gray-800 rounded-2xl p-6 text-white">
              <h3 className="text-lg text-white mb-6 flex items-center">
                <Activity className="mr-2 text-dark-primary" size={20} />
                {t('revenue_chart')}
              </h3>
              <div className="h-[300px] flex items-end space-x-2 pt-10">
                {revenueChart.map((point, index) => {
                  const heightPercent = maxRevenue > 0 ? (point.amount / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                        {util.formatVND(point.amount)}
                      </div>

                      {/* Bar */}
                      <div className="w-full flex justify-center h-full items-end pb-2">
                        <div
                          className="w-4/5 bg-dark-primary/60 hover:bg-dark-primary rounded-t-sm transition-all duration-500"
                          style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                        ></div>
                      </div>

                      {/* Label */}
                      <div className="text-[10px] text-gray-500 mt-2 rotate-45 md:rotate-0 truncate w-full text-center">
                        {new Date(point.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Phễu khách hàng */}
            <div className="bg-dark-card border border-gray-800 rounded-2xl p-6 text-white">
              <h3 className="text-lg text-white mb-6 flex items-center">
                <PieChart className="mr-2 text-indigo-400" size={20} />
                {t('funnel_title')}
              </h3>

              <div className="space-y-6">
                {[
                  { label: t('registered'), value: funnelData.registered, color: "bg-blue-500", width: "100%" },
                  { label: t('screened'), value: funnelData.screened, color: "bg-indigo-500", width: `${funnelData.registered ? (funnelData.screened / funnelData.registered) * 100 : 0}%` },
                  { label: t('paid'), value: funnelData.paid, color: "bg-purple-500", width: `${funnelData.registered ? (funnelData.paid / funnelData.registered) * 100 : 0}%` },
                  { label: t('injected'), value: funnelData.injected, color: "bg-green-500", width: `${funnelData.registered ? (funnelData.injected / funnelData.registered) * 100 : 0}%` }
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex justify-between text-sm mb-1 pb-1">
                      <span className="text-gray-300 font-medium">{step.label}</span>
                      <span className="text-white">{step.value}</span>
                    </div>
                    <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${step.color} rounded-full transition-all duration-1000`}
                        style={{ width: step.width }}
                      ></div>
                    </div>
                    {idx < 3 && (
                      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-gray-600">
                        <ArrowRight size={14} className="rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Top Vaccines */}
          <div className="bg-dark-card border border-gray-800 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg text-white flex items-center">
                <Syringe className="mr-2 text-green-400" size={20} />
                {t('top_vaccines_title')}
              </h3>
            </div>

            {topVaccines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="p-4 text-[12px] text-gray-500 uppercase font-medium">{t('top_vaccines_rank')}</th>
                      <th className="p-4 text-[12px] text-gray-500 uppercase font-medium">{t('top_vaccines_name')}</th>
                      <th className="p-4 text-[12px] text-gray-500 uppercase font-medium text-right">{t('top_vaccines_count')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {topVaccines.map((vaccine, index) => (
                      <tr key={vaccine.vaccineId} className="hover:bg-gray-800/20 transition-colors">
                        <td className="p-4 text-gray-400 font-mono">#{index + 1}</td>
                        <td className="p-4 text-gray-200 font-medium">{vaccine.vaccineName}</td>
                        <td className="p-4 text-right">
                          <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 shadow-lg shadow-green-500/10">
                            {vaccine.usageCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500 italic">
                {t('no_vaccine_data') || 'No vaccine data available'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
