import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Search,
  Loader2,
  ChevronRight,
  Stethoscope,
  Calendar,
  Activity,
  Thermometer,
  Weight,
  ArrowUp,
  Heart,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Clock,
  Zap,
  ChevronLeft
} from 'lucide-react';
import api from '@/web-configs/api';
import { AppAlert, AppConfirm } from '@/components/AppDialogs';
import { ScreeningVisit, Vaccine } from '@/types';

interface PaginationState {
  page: number;
  pageSize: number;
  totalCount: number;
}

interface ScreeningFormData {
  [key: string]: string | number | boolean | string[];
  temperature: string | number;
  weight: string | number;
  height: string | number;
  heartRate: string | number;
  respiratoryRate: string | number;
  bloodPressure: string;
  clinicalAssessment: string;
  isEligible: boolean;
  doctorNote: string;
  vaccineIds: string[];
}

interface AlertConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

interface ConfirmConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const ScreeningPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number>(0); // 0: Chờ khám, 1: Đã khám
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({ page: 1, pageSize: 8, totalCount: 0 });
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [queue, setQueue] = useState<ScreeningVisit[]>([]);
  const [loadingQueue, setLoadingQueue] = useState<boolean>(false);
  const [selectedVisit, setSelectedVisit] = useState<ScreeningVisit | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState<ScreeningFormData>({
    temperature: '',
    weight: '',
    height: '',
    heartRate: '',
    respiratoryRate: '',
    bloodPressure: '',
    clinicalAssessment: '',
    isEligible: true,
    doctorNote: '',
    vaccineIds: []
  });

  const [alertConfig, setAlertConfig] = useState<AlertConfig>({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmConfig, setConfirmConfig] = useState<ConfirmConfig>({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  const fetchQueue = useCallback(async (page: number = pagination.page, tab: number = activeTab, date: string = selectedDate, search: string = searchTerm) => {
    setLoadingQueue(true);
    try {
      const response = await api.get('/screening/queue', {
        params: {
          status: tab,
          date: date,
          page: page,
          pageSize: 8,
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
    } catch (error: any) {
      console.error('Error fetching queue:', error);
    } finally {
      setLoadingQueue(false);
    }
  }, [activeTab, selectedDate, pagination.page, searchTerm]);

  useEffect(() => {
    fetchQueue(1, activeTab, selectedDate, searchTerm);
  }, [activeTab, selectedDate, searchTerm, fetchQueue]);

  useEffect(() => {
    const interval = setInterval(() => fetchQueue(pagination.page, activeTab, selectedDate, searchTerm), 30000);
    return () => clearInterval(interval);
  }, [fetchQueue, pagination.page, activeTab, selectedDate, searchTerm]);

  const handleSelectVisit = async (visit: ScreeningVisit) => {
    try {
      const response = await api.get(`/screening/${visit.visitId}`);
      if (response.data.success) {
        const detail = response.data.data;
        setSelectedVisit({ ...detail, visitId: visit.visitId });
        setFormData({
          temperature: detail.hasScreeningResult ? detail.temperature : '',
          weight: detail.hasScreeningResult ? detail.weight : '',
          height: detail.hasScreeningResult ? detail.height : '',
          heartRate: detail.hasScreeningResult ? detail.heartRate : '',
          respiratoryRate: detail.hasScreeningResult ? detail.respiratoryRate : '',
          bloodPressure: detail.hasScreeningResult ? detail.bloodPressure : '',
          clinicalAssessment: detail.hasScreeningResult ? detail.clinicalAssessment : '',
          isEligible: detail.hasScreeningResult ? detail.isEligible : true,
          doctorNote: detail.hasScreeningResult ? detail.doctorNote : '',
          vaccineIds: detail.preSelectedVaccines.map((v: Vaccine) => v.vaccineId)
        });
      }
    } catch (error) {
      console.error('Error fetching visit detail:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleQuickFill = (isEligible: boolean) => {
    if (!selectedVisit) return;

    if (isEligible) {
      setFormData({
        temperature: '36.5',
        weight: '65',
        height: '170',
        heartRate: '80',
        respiratoryRate: '20',
        bloodPressure: '120/80',
        clinicalAssessment: t('clinical_pass'),
        isEligible: true,
        doctorNote: t('note_pass'),
        vaccineIds: selectedVisit.preSelectedVaccines.map(v => v.vaccineId)
      });
    } else {
      setFormData({
        temperature: '38.5',
        weight: '65',
        height: '170',
        heartRate: '95',
        respiratoryRate: '24',
        bloodPressure: '130/85',
        clinicalAssessment: t('clinical_fail'),
        isEligible: false,
        doctorNote: t('note_fail'),
        vaccineIds: []
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedVisit) return;

    setConfirmConfig({
      isOpen: true,
      title: 'Xác nhận kết luận',
      message: `Bạn xác nhận kết luận khám sàng lọc cho bệnh nhân ${selectedVisit.fullName}?`,
      onConfirm: async () => {
        setSubmitting(true);
        try {
          // Dọn dẹp các field số: chuyển "" thành null
          const cleanedData: any = { ...formData };
          ['temperature', 'weight', 'height', 'heartRate', 'respiratoryRate'].forEach(field => {
            if (cleanedData[field] === '') {
              cleanedData[field] = null;
            } else {
              cleanedData[field] = parseFloat(cleanedData[field] as string);
            }
          });

          const response = await api.post('/screening/save', {
            ...cleanedData,
            visitId: selectedVisit.visitId
          });

          if (response.data.success) {
            setSelectedVisit(null);
            fetchQueue();
          }
        } catch (error: any) {
          console.error('Save screening failed:', error);
          const errorMsg = error.response?.data?.message || 'Không thể lưu kết quả. Vui lòng thử lại.';
          setAlertConfig({
            isOpen: true,
            type: 'error',
            title: 'Lỗi',
            message: errorMsg
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

        {/* Left: DS chờ khám */}
        <div className="lg:col-span-3 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-0 border-b border-gray-800 bg-gray-900/50">
            <div className="flex justify-between items-center p-4 border-b border-gray-800/50">
              <h3 className="text-[14px] font-bold text-white flex items-center">
                <Clock className="mr-2 text-dark-primary" size={18} />
                {t('queue_title')}
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
                {t('tab_waiting').toUpperCase()} ({activeTab === 0 ? pagination.totalCount : '...'})
                {activeTab === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-primary"></div>}
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 py-3 text-[12px] font-bold transition-all relative ${activeTab === 1 ? 'text-dark-primary' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {t('tab_done').toUpperCase()} ({activeTab === 1 ? pagination.totalCount : '...'})
                {activeTab === 1 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-dark-primary"></div>}
              </button>
            </div>
          </div>

          <div className="p-3 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input
                type="text"
                placeholder={t('common_search_placeholder')}
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
                        {new Date(item.checkInTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-[13px] font-medium text-gray-200 group-hover:text-white">{item.fullName}</h4>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-[11px] text-gray-500">{new Date().getFullYear() - new Date(item.dob).getFullYear()} {t('common_age')}</span>
                      <span className="text-[11px] text-gray-500">•</span>
                      <span className="text-[11px] text-gray-500">{item.gender}</span>
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

        {/* Right: Form khám */}
        <div className="lg:col-span-9 flex flex-col bg-dark-card border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {!selectedVisit ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600 space-y-4">
              <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
                <Stethoscope size={40} className="text-gray-500" />
              </div>
              <p className="text-lg font-medium">{t('screening_select_patient')}</p>
            </div>
          ) : (
            <>
              {/* Patient Info Header */}
              <div className="p-6 border-b border-gray-800 bg-indigo-500/5 grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Phần 1: Thông tin bệnh nhân */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-dark-primary flex items-center justify-center text-white font-bold text-xl">
                    {selectedVisit.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedVisit.fullName}</h2>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-dark-primary font-mono font-bold">{selectedVisit.pid}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">{selectedVisit.gender}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-400">
                        {new Date(selectedVisit.dob).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Phần 2: Nút dùng để test nhanh */}
                <div className="items-center space-x-4">
                  <p className="text-[12px]">{t('screening_quick_note')}</p>
                  <div className="flex items-center space-x-2 border-r border-gray-800 pr-4">
                    <button
                      onClick={() => handleQuickFill(true)}
                      disabled={activeTab === 1}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-[12px] font-bold uppercase transition-all ${activeTab === 1 ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed' : 'bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20'}`}
                    >
                      <Zap size={14} />
                      <span>{t('screening_quick_pass')}</span>
                    </button>

                    <button
                      onClick={() => handleQuickFill(false)}
                      disabled={activeTab === 1}
                      className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border text-[12px] font-bold uppercase transition-all ${activeTab === 1 ? 'bg-gray-800/50 border-gray-700 text-gray-600 cursor-not-allowed' : 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'}`}
                    >
                      <Zap size={14} />
                      <span>{t('screening_quick_fail')}</span>
                    </button>
                  </div>
                </div>

                {/* Phần 3: Tiền sử bệnh */}
                <div className="flex justify-end items-center">
                  <div className="text-right">
                    <p className="text-[12px] text-gray-500 uppercase font-bold">{t('screening_history_title')}</p>
                    <p className="text-xs text-red-400 font-medium italic truncate max-w-[300px]">
                      {selectedVisit.medicalHistory || t('screening_history_no_record')}
                    </p>
                  </div>
                </div>

              </div>

              {/* Nội dung form */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* 1. Chỉ số sinh tồn */}
                <section>
                  <div className="flex items-center space-x-2 mb-4">
                    <Activity className="text-dark-primary" size={20} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('screening_vital_signs')}</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: t('screening_fields_temperature'), name: 'temperature', icon: <Thermometer size={16} />, placeholder: '36.5' },
                      { label: t('screening_fields_weight'), name: 'weight', icon: <Weight size={16} />, placeholder: '65' },
                      { label: t('screening_fields_height'), name: 'height', icon: <ArrowUp size={16} />, placeholder: '170' },
                      { label: t('screening_fields_heart_rate'), name: 'heartRate', icon: <Heart size={16} />, placeholder: '80' },
                      { label: t('screening_fields_respiratory_rate'), name: 'respiratoryRate', icon: <Activity size={16} />, placeholder: '20' },
                      { label: t('screening_fields_blood_pressure'), name: 'bloodPressure', icon: <Activity size={16} />, placeholder: '120/80' },
                    ].map((field) => (
                      <div key={field.name} className="space-y-1.5">
                        <label className="text-[12px] font-bold text-gray-500 uppercase flex items-center">
                          <span className="mr-1">{field.icon}</span>
                          {field.label}
                        </label>
                        <input
                          type="text"
                          name={field.name}
                          value={formData[field.name] as string | number}
                          onChange={handleInputChange}
                          placeholder={field.placeholder}
                          disabled={activeTab === 1}
                          className={`w-full bg-dark-bg border border-gray-700 rounded-lg px-3 py-2 text-sm focus:border-dark-primary outline-none transition-all font-mono ${activeTab === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* 2. Đánh giá lâm sàng */}
                <section>
                  <div className="flex items-center space-x-2 mb-4">
                    <Stethoscope className="text-dark-primary" size={20} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{t('screening_clinical_exam')}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-gray-500 uppercase">{t('screening_general_eval')}</label>
                        <textarea
                          name="clinicalAssessment"
                          value={formData.clinicalAssessment as string}
                          onChange={handleInputChange}
                          disabled={activeTab === 1}
                          rows={4}
                          className={`w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-dark-primary outline-none transition-all resize-none ${activeTab === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder={t('screening_clinical_placeholder')}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-gray-500 uppercase">{t('screening_doctor_notes')}</label>
                        <textarea
                          name="doctorNote"
                          value={formData.doctorNote as string}
                          onChange={handleInputChange}
                          disabled={activeTab === 1}
                          rows={3}
                          className={`w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 text-sm focus:border-dark-primary outline-none transition-all resize-none ${activeTab === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          placeholder={t('screening_doctor_note_placeholder')}
                        />
                      </div>
                    </div>

                    <div className="bg-dark-bg/30 rounded-2xl border border-gray-800 p-6 flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <label className="text-[12px] font-bold text-gray-500 uppercase">{t('screening_designated_vaccines')}</label>
                        <span className="text-[12px] font-bold text-dark-primary bg-dark-primary/10 px-2 py-0.5 rounded">
                          {formData.vaccineIds.length} {t('payment_vaccine')}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin scrollbar-thumb-gray-800">
                        {selectedVisit.preSelectedVaccines.map(v => (
                          <div key={v.vaccineId} className="flex items-center justify-between p-3 bg-dark-card border border-gray-800 rounded-xl group hover:border-dark-primary transition-colors">
                            <span className="text-xs font-medium text-gray-200">{v.vaccineName}</span>
                            <input
                              type="checkbox"
                              checked={formData.vaccineIds.includes(v.vaccineId)}
                              onChange={(e) => {
                                if (activeTab === 1) return;
                                const checked = e.target.checked;
                                setFormData(prev => ({
                                  ...prev,
                                  vaccineIds: checked
                                    ? [...prev.vaccineIds, v.vaccineId]
                                    : prev.vaccineIds.filter(id => id !== v.vaccineId)
                                }));
                              }}
                              disabled={activeTab === 1}
                              className={`w-4 h-4 accent-dark-primary cursor-pointer ${activeTab === 1 ? 'cursor-not-allowed' : ''}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500">{t('injection_subtotal')}:</span>
                        <span className="text-sm font-bold text-dark-primary">
                          {selectedVisit.preSelectedVaccines
                            .filter(v => formData.vaccineIds.includes(v.vaccineId))
                            .reduce((sum, v) => sum + v.price, 0)
                            .toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Quyết định cuối cùng */}
                <section className="bg-dark-primary/5 rounded-3xl border border-dark-primary/20 p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                      <h3 className="text-lg font-bold text-white uppercase tracking-wider">{t('conclusion')}:</h3>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => activeTab === 0 && setFormData(prev => ({ ...prev, isEligible: true }))}
                          disabled={activeTab === 1}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border transition-all ${formData.isEligible
                            ? 'bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/20'
                            : 'bg-dark-bg border-gray-800 text-gray-500 hover:border-green-500/50'
                            } ${activeTab === 1 ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <CheckCircle2 size={20} />
                          <span>{t('screening_eligible_title')}</span>
                        </button>
                        <button
                          onClick={() => activeTab === 0 && setFormData(prev => ({ ...prev, isEligible: false }))}
                          disabled={activeTab === 1}
                          className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border transition-all ${!formData.isEligible
                            ? 'bg-red-500 border-red-400 text-white shadow-lg shadow-red-500/20'
                            : 'bg-dark-bg border-gray-800 text-gray-500 hover:border-red-500/50'
                            } ${activeTab === 1 ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <XCircle size={20} />
                          <span>{t('screening_postpone')}</span>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting || activeTab === 1}
                      className="flex items-center space-x-2 px-10 py-4 rounded-2xl bg-dark-primary text-white hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      <span>{t('screening_confirm')}</span>
                    </button>
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <AppAlert
        {...alertConfig}
        onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
      />
      <AppConfirm
        {...confirmConfig}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Date Picker Modal */}
      {showDatePicker && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-card border border-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-lg text-white font-medium flex items-center">
                <Calendar className="mr-3 text-dark-primary" />
                {t('screening_select_date')}
              </h3>
              <button onClick={() => setShowDatePicker(false)} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
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
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreeningPage;
