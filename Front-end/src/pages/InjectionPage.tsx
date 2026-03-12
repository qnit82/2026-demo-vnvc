import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Loader2,
  CheckCircle2,
  Zap,
  Clock,
  Syringe,
  AlertTriangle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  X
} from 'lucide-react';
import { InjectionQueueItem, InjectionDetail, PrescribedVaccine } from '@/types';
import api from '@/web-configs/api';
import { AppAlert, AppConfirm } from '@/components/AppDialogs';

interface InjectionFormState {
  [key: string]: {
    batchId: string;
    injectionSite: string;
  };
}

const InjectionPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0); // 0: Chờ tiêm, 1: Đã tiêm
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 8, totalCount: 0 });
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [queue, setQueue] = useState<InjectionQueueItem[]>([]);
  const [loadingQueue, setLoadingQueue] = useState<boolean>(false);
  const [selectedVisit, setSelectedVisit] = useState<InjectionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [injectionData, setInjectionData] = useState<InjectionFormState>({}); // { prescriptionId: { batchId, injectionSite } }

  const [alertConfig, setAlertConfig] = useState<any>({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmConfig, setConfirmConfig] = useState<any>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  const fetchQueue = useCallback(async (page = pagination.page, tab = activeTab, date = selectedDate, search = searchTerm) => {
    setLoadingQueue(true);
    try {
      const response = await api.get('/injection/queue', {
        params: {
          status: tab,
          date: date,
          page: page,
          pageSize: pagination.pageSize,
          searchTerm: search
        }
      });
      if (response.data.success && response.data.data) {
        setQueue(response.data.data.items || []);
        setPagination(prev => ({
          ...prev,
          totalCount: response.data.data.totalCount || 0,
          page: response.data.data.page || 1
        }));
      }
    } catch (error) {
      console.error('Error fetching injection queue:', error);
    } finally {
      setLoadingQueue(false);
    }
  }, [activeTab, selectedDate, pagination.page, pagination.pageSize, searchTerm]);

  useEffect(() => {
    fetchQueue(1, activeTab, selectedDate, searchTerm);
  }, [activeTab, selectedDate, searchTerm, fetchQueue]);

  useEffect(() => {
    const interval = setInterval(() => fetchQueue(pagination.page, activeTab, selectedDate, searchTerm), 30000);
    return () => clearInterval(interval);
  }, [fetchQueue, pagination.page, activeTab, selectedDate, searchTerm]);

  const handleSelectVisit = async (visit: { visitId: string }) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/injection/${visit.visitId}`);
      if (response.data.success) {
        const detail: InjectionDetail = response.data.data;
        setSelectedVisit(detail);

        // Khởi tạo data mặc định cho các mũi chưa tiêm
        const initialData: InjectionFormState = {};
        detail.prescribedVaccines.forEach((p: PrescribedVaccine) => {
          if (!p.isInjected) {
            initialData[p.prescriptionId] = {
              batchId: p.availableBatches.length > 0 ? p.availableBatches[0].batchId : '',
              injectionSite: 'Tay trái (Cơ Delta)'
            };
          }
        });
        setInjectionData(initialData);
      }
    } catch (error) {
      console.error('Error fetching injection detail:', error);
      setAlertConfig({
        isOpen: true,
        type: 'error',
        title: t('common_error') || 'Error',
        message: t('injection_not_found') || 'No injection detail found.'
      });
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleConfirmInjection = async (prescriptionId: string) => {
    const data = injectionData[prescriptionId];
    if (!data || !data.batchId) {
      setAlertConfig({
        isOpen: true,
        type: 'warning',
        title: t('common_missing_info') || 'Missing info',
        message: t('injection_select_batch_prompt') || 'Please select a batch.'
      });
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: t('injection_confirm_injection_btn') || 'Confirm injection',
      message: t('injection_confirm_injection_msg') || 'Are you sure you want to confirm this injection?',
      onConfirm: async () => {
        setSubmitting(true);
        try {
          const response = await api.post('/injection/confirm', {
            prescriptionId,
            batchId: data.batchId,
            injectionSite: data.injectionSite
          });

          if (response.data.success) {
            if (selectedVisit) {
              handleSelectVisit({ visitId: selectedVisit.visitId });
            }
            fetchQueue();
          }
        } catch (error) {
          console.error('Confirm injection failed:', error);
          setAlertConfig({
            isOpen: true,
            type: 'error',
            title: t('common_error') || 'Error',
            message: t('injection_injection_error') || 'Injection failed.'
          });
        } finally {
          setSubmitting(false);
        }
      }
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-120px)]">

        {/* Left: Queue List */}
        <div className="lg:col-span-3 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-0 border-b border-gray-800 bg-gray-900/50">
            <div className="flex justify-between items-center p-4 border-b border-gray-800/50">
              <h3 className="text-[14px] font-bold text-white flex items-center">
                <Clock className="mr-2 text-dark-primary" size={18} />
                {t('injection_injection_queue')}
              </h3>
              <button
                onClick={() => setShowDatePicker(true)}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors flex items-center space-x-2 text-[11px]"
              >
                <Calendar size={14} />
                <span>{new Date(selectedDate).toLocaleDateString('vi-VN')}</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex">
              <button
                onClick={() => setActiveTab(0)}
                className={`flex-1 py-3 text-[12px] font-bold transition-all relative ${activeTab === 0 ? 'text-dark-primary' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t('injection_waiting_injection_tab')} ({activeTab === 0 ? pagination.totalCount : '...'})
                {activeTab === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-primary"></div>}
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 py-3 text-[12px] font-bold transition-all relative ${activeTab === 1 ? 'text-dark-primary' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t('injection_injected_tab')} ({activeTab === 1 ? pagination.totalCount : '...'})
                {activeTab === 1 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-primary"></div>}
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                placeholder={t('common_search_placeholder') || 'Search...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark-bg/80 border border-gray-700/50 rounded-xl py-2 pl-9 pr-4 text-[12px] text-gray-300 focus:border-dark-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-800/50">
            {loadingQueue ? (
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <Loader2 className="animate-spin text-dark-primary" size={32} />
                <p className="text-xs text-gray-500">{t('common_updating')}</p>
              </div>
            ) : queue.length > 0 ? (
              <>
                {queue.map((item) => (
                  <div
                    key={item.visitId}
                    onClick={() => handleSelectVisit(item)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-800/50 group relative border-l-4 ${selectedVisit?.visitId === item.visitId ? 'border-dark-primary bg-dark-primary/5' : 'border-transparent'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[11px] font-mono text-dark-primary ">{item.pid}</span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(item.screeningTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-medium text-gray-200 group-hover:text-white">{item.fullName}</h4>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-[11px] text-gray-500">{new Date().getFullYear() - new Date(item.dob).getFullYear()} {t('common_age')}</span>
                      <span className="text-[11px] text-gray-400 italic truncate max-w-[150px] ml-auto">
                        {item.doctorNote}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 opacity-50 p-6 text-center">
                <Users size={40} className="mb-3" />
                <p className="text-[12px]">{t('common_no_patient_data')}</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalCount > pagination.pageSize && (
            <div className="p-3 border-t border-gray-800 bg-gray-900/30 flex items-center justify-between">
              <span className="text-[11px] text-gray-500">
                {queue.length}/{pagination.totalCount}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchQueue(pagination.page - 1)}
                  className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-20 transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[11px] text-gray-400 px-2">{pagination.page}</span>
                <button
                  disabled={pagination.page * pagination.pageSize >= pagination.totalCount}
                  onClick={() => fetchQueue(pagination.page + 1)}
                  className="p-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 disabled:opacity-20 transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Các tác vụ Tiêm */}
        <div className="lg:col-span-9 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {!selectedVisit ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                <Syringe size={40} className="text-gray-500" />
              </div>
              <p className="text-lg font-medium">{t('injection_select_patient')}</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-800 bg-indigo-500/5 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-dark-primary flex items-center justify-center text-white  text-xl uppercase">
                    {selectedVisit.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl text-white">{selectedVisit.fullName}</h2>
                    <div className="flex items-center space-x-3 mt-1 text-[12px]">
                      <span className="text-dark-primary font-mono ">{selectedVisit.pid}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{selectedVisit.gender}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{new Date(selectedVisit.dob).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[12px] text-gray-500  uppercase mb-1">{t('injection_header_doctor_note')}</p>
                  <p className="text-[14px] text-indigo-400 font-medium italic">
                    {selectedVisit.doctorNote || t('injection_header_no_note')}
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Syringe className="text-dark-primary" size={22} />
                  <h3 className="text-[16px] text-white uppercase tracking-wider">{t('injection_vaccine_list')}</h3>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {selectedVisit.prescribedVaccines.map((v) => (
                    <div key={v.prescriptionId} className={`p-6 rounded-3xl border transition-all ${v.isInjected
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-dark-bg/50 border-gray-800 hover:border-dark-primary/30'
                      }`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg text-white">{v.vaccineName}</h4>
                            <span className="px-2 py-0.5 rounded-lg bg-dark-primary/10 text-dark-primary text-[10px]  uppercase">
                              Mũi {v.doseNumber}
                            </span>
                            {v.isInjected && (
                              <span className="flex items-center space-x-1 text-green-400 text-[12px] ">
                                <CheckCircle2 size={16} />
                                <span>{t('injected')}</span>
                              </span>
                            )}
                          </div>

                          {!v.isInjected && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="space-y-1.5">
                                <label className="text-[12px] text-gray-500  uppercase">{t('injection_fefo_queue')}</label>
                                <select
                                  value={injectionData[v.prescriptionId]?.batchId || ''}
                                  onChange={(e) => setInjectionData(prev => ({
                                    ...prev,
                                    [v.prescriptionId]: { ...prev[v.prescriptionId], batchId: e.target.value }
                                  }))}
                                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:border-dark-primary outline-none transition-all"
                                >
                                  {v.availableBatches.map(b => (
                                    <option key={b.batchId} value={b.batchId}>
                                      {b.batchNumber} (HSD: {new Date(b.expiryDate).toLocaleDateString('vi-VN')}) - Tồn: {b.quantityInStock}
                                    </option>
                                  ))}
                                  {v.availableBatches.length === 0 && <option value="">{t('injection_out_of_stock')}</option>}
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-[12px] text-gray-500  uppercase">{t('injection_injection_site')}</label>
                                <input
                                  type="text"
                                  value={injectionData[v.prescriptionId]?.injectionSite || ''}
                                  onChange={(e) => setInjectionData(prev => ({
                                    ...prev,
                                    [v.prescriptionId]: { ...prev[v.prescriptionId], injectionSite: e.target.value }
                                  }))}
                                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:border-dark-primary outline-none transition-all"
                                  placeholder={t('injection_injection_site_placeholder') || 'Enter site...'}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {!v.isInjected && (
                          <button
                            onClick={() => handleConfirmInjection(v.prescriptionId)}
                            disabled={submitting || v.availableBatches.length === 0}
                            className="flex items-center justify-center space-x-2 px-8 py-4 rounded-2xl bg-dark-primary text-white hover:bg-indigo-600 transition-all  disabled:opacity-50 h-fit self-center"
                          >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                            <span>{t('injection_confirm_injection_btn')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Warning */}
                <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl flex items-start space-x-3 text-yellow-200/70">
                  <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                  <div className="text-[13px]">
                    <p className=" mb-1">{t('injection_rule_35_title')}</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>{t('rule1')}</li>
                      <li>{t('rule2')}</li>
                      <li>{t('rule3')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <AppAlert
        {...alertConfig}
        onClose={() => setAlertConfig((prev: any) => ({ ...prev, isOpen: false }))}
      />
      <AppConfirm
        {...confirmConfig}
        onClose={() => setConfirmConfig((prev: any) => ({ ...prev, isOpen: false }))}
      />

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-dark-card border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg text-white font-medium flex items-center">
                <Calendar className="mr-3 text-dark-primary" />
                {t('common_select_date')}
              </h3>
              <button onClick={() => setShowDatePicker(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-8">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setShowDatePicker(false);
                }}
                className="w-full bg-dark-bg border border-gray-700 rounded-2xl p-4 text-white focus:border-dark-primary outline-none transition-all text-lg"
              />
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-full mt-6 py-4 bg-dark-primary text-white rounded-2xl font-medium hover:bg-indigo-600 transition-all shadow-lg"
              >
                {t('common_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InjectionPage;
