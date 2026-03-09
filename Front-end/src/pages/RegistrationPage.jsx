import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  User,
  ShieldCheck,
  MapPin,
  Stethoscope,
  Syringe,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Search,
  Calendar,
  Phone,
  CreditCard,
  Loader2
} from 'lucide-react';
import api from '@/web-configs/api';
import { AppAlert, AppConfirm } from '@/components/AppDialogs';
import CustomerList from '@/components/CustomerList';
import VaccineSelector from '@/components/VaccineSelector';

const RegistrationPage = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Refs for auto-focus
  const fullNameRef = useRef(null);
  const communeSearchRef = useRef(null);
  const medicalHistoryRef = useRef(null);
  const vaccineSearchRef = useRef(null);

  // Dialog States
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });

  const [formData, setFormData] = useState({
    id: null,
    pid: '',
    fullName: '',
    dob: '',
    gender: 'Nam',
    phone: '',
    identityCard: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: 'Cha',
    address: '',
    commune: '',
    province: '',
    medicalHistory: '',
    selectedVaccines: [], // Lưu trữ object vaccine đầy đủ
    appointmentDate: new Date().toISOString().split('T')[0]
  });

  const [communes, setCommunes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const steps = [
    { id: 1, title: t('registration_steps_personal_info'), icon: <User size={20} /> },
    { id: 2, title: t('registration_steps_contact'), icon: <ShieldCheck size={20} /> },
    { id: 3, title: t('registration_steps_address'), icon: <MapPin size={20} /> },
    { id: 4, title: t('registration_steps_medical'), icon: <Stethoscope size={20} /> },
    { id: 5, title: t('registration_steps_vaccines'), icon: <Syringe size={20} /> },
    { id: 6, title: t('registration_steps_confirm'), icon: <CheckCircle2 size={20} /> },
  ];

  useEffect(() => {
    fetchCommunes();
  }, []);

  const fetchCommunes = async () => {
    try {
      const response = await api.get('/util/commune');
      setCommunes(response.data.communes || []);
    } catch (error) {
      console.error('Error fetching communes:', error);
    }
  };

  const removeAccents = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  const handleSearchCommune = (val) => {
    setSearchTerm(val);
    if (!val.trim()) {
      setSuggestions([]);
      return;
    }

    const searchVal = removeAccents(val);
    const filtered = communes.filter(c =>
      removeAccents(c.name).includes(searchVal) ||
      removeAccents(c.provinceName).includes(searchVal)
    );

    setSuggestions(filtered.slice(0, 10));

    if (filtered.length === 1) {
      selectCommune(filtered[0]);
    }
  };

  const selectCommune = (c) => {
    setFormData(prev => ({
      ...prev,
      commune: c.name,
      province: c.provinceName
    }));
    setSearchTerm(c.name);
    setSuggestions([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isMinor = useCallback(() => {
    if (!formData.dob) return false;
    const birthDate = new Date(formData.dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    return age < 18;
  }, [formData.dob]);

  const nextStep = useCallback(() => {
    if (currentStep === 1 && !isMinor()) {
      setCurrentStep(3);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  }, [currentStep, isMinor]);

  const prevStep = useCallback(() => {
    if (currentStep === 3 && !isMinor()) {
      setCurrentStep(1);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  }, [currentStep, isMinor]);

  const handleSelectCustomer = (customer) => {
    // Tách địa chỉ nếu cần (tạm thời để nguyên field address)
    setFormData({
      ...formData,
      id: customer.id,
      pid: customer.pid,
      fullName: customer.fullName,
      dob: customer.dob.split('T')[0],
      gender: customer.gender,
      phone: customer.phone,
      identityCard: customer.identityCard || '',
      guardianName: customer.guardianName || '',
      guardianPhone: customer.guardianPhone || '',
      guardianRelation: customer.guardianRelation || 'Cha',
      address: customer.address,
      medicalHistory: customer.medicalHistory || '',
    });
    setCurrentStep(1);
    if (fullNameRef.current) fullNameRef.current.focus();
  };

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      id: null,
      pid: '',
      fullName: '',
      dob: '',
      gender: 'Nam',
      phone: '',
      identityCard: '',
      guardianName: '',
      guardianPhone: '',
      guardianRelation: 'Cha',
      address: '',
      commune: '',
      province: '',
      medicalHistory: '',
      selectedVaccines: [],
      appointmentDate: new Date().toISOString().split('T')[0]
    });
    setSearchTerm('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.fullName.trim() || !formData.dob || !formData.phone.trim()) {
      setAlertConfig({
        isOpen: true,
        type: 'warning',
        title: t('registration_missing_fields_title'),
        message: t('registration_missing_info')
      });
      return;
    }

    setConfirmConfig({
      isOpen: true,
      title: t('registration_confirm_title'),
      message: `${t('registration_confirm_msg_full')} ${formData.fullName}?`,
      onConfirm: async () => {
        setSubmitting(true);
        try {
          const payload = {
            ...formData,
            vaccineIds: formData.selectedVaccines.map(v => v.id),
            // Nếu commune/province đã được chọn, nối vào address
            address: formData.commune ? `${formData.address}, ${formData.commune}, ${formData.province}` : formData.address
          };

          const response = await api.post('/customer/register', payload);

          if (response.data.success) {
            resetForm();
          }
        } catch (error) {
          console.error('Registration failed:', error);
          const errorMsg = error.response?.data?.message || t('registration_error');
          setAlertConfig({
            isOpen: true,
            type: 'error',
            title: t('common_error'),
            message: errorMsg
          });
        } finally {
          setSubmitting(false);
        }
      }
    });
  }, [formData, resetForm, user.token]);

  // Auto-focus logic
  useEffect(() => {
    if (currentStep === 1 && fullNameRef.current) {
      fullNameRef.current.focus();
    } else if (currentStep === 3 && communeSearchRef.current) {
      communeSearchRef.current.focus();
    } else if (currentStep === 4 && medicalHistoryRef.current) {
      medicalHistoryRef.current.focus();
    }
  }, [currentStep]);

  // Keyboard shortcuts logic
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Nếu có bất kỳ Dialog nào đang mở, không xử lý phím tắt trang
      if (alertConfig.isOpen || confirmConfig.isOpen) return;

      // F1: Quay lại - Cho phép chạy dù đang focus vào input nào
      if (e.key === 'F1') {
        e.preventDefault();
        prevStep();
        return;
      }

      // F2: Tiếp theo - Cho phép chạy dù đang focus vào input nào
      if (e.key === 'F2') {
        e.preventDefault();
        if (currentStep < 6) nextStep();
        return;
      }

      // Enter: Xử lý riêng biệt
      if (e.key === 'Enter') {
        // Nếu đang ở bước 6 và KHÔNG focus vào bất kỳ input nào
        if (currentStep === 6 && !submitting) {
          if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            handleSubmit();
            return;
          }
        }

        // Nếu đang focus vào input/textarea ở các bước khác (hoặc bước 6 ô search), Enter sẽ bị chặn (không cho nhảy bước)
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, submitting, handleSubmit, nextStep, prevStep, alertConfig.isOpen, confirmConfig.isOpen]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_fields_full_name')}</label>
                <input
                  ref={fullNameRef}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 focus:border-dark-primary outline-none transition-all"
                  placeholder="VD: Nguyen Van A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_fields_dob')}</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:border-dark-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_fields_gender')}</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 focus:border-dark-primary outline-none transition-all"
                >
                  <option>{t('registration_gender_male')}</option>
                  <option>{t('registration_gender_female')}</option>
                  <option>{t('registration_gender_other')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_fields_phone')}</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:border-dark-primary outline-none transition-all"
                    placeholder="09xx xxx xxx"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_cccd')}</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    name="identityCard"
                    value={formData.identityCard}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:border-dark-primary outline-none transition-all"
                    placeholder={t('enterPID')}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-sm">
              {t('registration_guardian_note')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_guardian_name')}</label>
                <input
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 focus:border-dark-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_fields_guardian_relation')}</label>
                <select
                  name="guardianRelation"
                  value={formData.guardianRelation}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 focus:border-dark-primary outline-none transition-all"
                >
                  <option>{t('registration_guardian_relations_father')}</option>
                  <option>{t('registration_guardian_relations_mother')}</option>
                  <option>{t('registration_guardian_relations_other')}</option>
                  <option>{t('registration_guardian_relations_sibling')}</option>
                  <option>{t('registration_guardian_legal')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_contact_phone')}</label>
                <input
                  name="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 focus:border-dark-primary outline-none transition-all"
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <div className="space-y-2 relative">
                <label className="text-sm font-medium text-gray-400">{t('registration_commune_label')}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    ref={communeSearchRef}
                    type="text"
                    placeholder={t('enterWard')}
                    className="w-full bg-dark-bg border border-gray-700 rounded-xl pl-10 pr-4 py-3 focus:border-dark-primary outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => handleSearchCommune(e.target.value)}
                  />
                </div>

                {/* Autocomplete Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-dark-card border border-gray-700 rounded-xl shadow-2xl">
                    {suggestions.map(c => (
                      <button
                        key={c.code}
                        onClick={() => selectCommune(c)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-800 border-b border-gray-800 last:border-0 transition-colors flex justify-between items-center group"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-white group-hover:text-dark-primary">{c.name}</span>
                          <span className="text-xs text-gray-500">{c.administrativeLevel}</span>
                        </div>
                        <span className="text-sm text-gray-400 font-medium italic">{c.provinceName}</span>
                      </button>
                    ))}
                  </div>
                )}

                {formData.province && !suggestions.length && (
                  <div className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between animate-in zoom-in-95">
                    <div className="flex items-center space-x-2">
                      <MapPin className="text-dark-primary" size={16} />
                      <span className="text-sm text-white font-bold">{formData.commune}</span>
                    </div>
                    <span className="text-xs text-indigo-400 font-mono uppercase tracking-tighter bg-indigo-500/20 px-2 py-1 rounded">
                      {formData.province}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_detail_address')}</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 focus:border-dark-primary outline-none transition-all resize-none"
                  placeholder={t('enterStreet')}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-500 text-sm">
                {t('registration_medical_history_note')}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">{t('registration_medical_history_title')}</label>
                <textarea
                  ref={medicalHistoryRef}
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full bg-dark-bg border border-gray-700 rounded-xl px-4 py-3 focus:border-dark-primary outline-none transition-all resize-none"
                  placeholder={t('registration_medical_history_placeholder')}
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <VaccineSelector
              ref={vaccineSearchRef}
              selectedVaccines={formData.selectedVaccines}
              onSelectVaccine={(v) => setFormData(prev => ({
                ...prev,
                selectedVaccines: [...prev.selectedVaccines, v]
              }))}
              onRemoveVaccine={(id) => setFormData(prev => ({
                ...prev,
                selectedVaccines: prev.selectedVaccines.filter(v => v.id !== id)
              }))}
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-dark-card rounded-2xl border border-gray-800 overflow-hidden">
              <div className="bg-indigo-500/10 px-6 py-4 border-b border-gray-800">
                <h3 className="font-bold text-dark-primary">{t('registration_summary_title')}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('registration_fields_full_name')}</p>
                    <p className="text-sm font-bold text-white">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('registration_fields_dob')}</p>
                    <p className="text-sm font-bold text-white">{formData.dob}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('registration_injection_address')}</p>
                    <p className="text-sm font-bold text-gray-300 leading-relaxed">
                      {formData.address}
                      {formData.commune && `, ${formData.commune}`}
                      {formData.province && `, ${formData.province}`}
                    </p>
                  </div>
                  {isMinor() && (
                    <div>
                      <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('registration_guardian')}</p>
                      <p className="text-sm font-bold text-white">{formData.guardianName} ({formData.guardianRelation})</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[12px] text-gray-500 uppercase tracking-widest font-bold mb-1">{t('registration_appointment_date_alt')}</p>
                    <p className="text-sm font-bold text-dark-primary">{formData.appointmentDate}</p>
                  </div>
                  <div className="col-span-2 mt-4">
                    <p className="text-xs text-gray-500 uppercase mb-2">{t('registration_selected_services')}</p>
                    <div className="bg-dark-bg/50 rounded-xl border border-gray-800 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-800/30 text-gray-400 text-[12px] uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">{t('inventory_table_vaccine_name')}</th>
                            <th className="px-4 py-2 text-right font-medium">{t('payment_unit_price')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                          {formData.selectedVaccines.map(v => (
                            <tr key={v.id} className="text-gray-300">
                              <td className="px-4 py-2">{v.name}</td>
                              <td className="px-4 py-2 text-right font-mono text-xs">
                                {v.price.toLocaleString('vi-VN')} đ
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-dark-primary/5 border-t border-dark-primary/20">
                          <tr className="text-white font-bold">
                            <td className="px-4 py-3">{t('common_total')}</td>
                            <td className="px-4 py-3 text-right text-dark-primary text-base">
                              {formData.selectedVaccines.reduce((sum, v) => sum + v.price, 0).toLocaleString('vi-VN')} VNĐ
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500">
              <CheckCircle2 size={20} />
              <p className="text-sm">{t('registration_subtitle_alt_2')}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Form Đăng ký */}
        <div className="lg:col-span-8">
          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{t('registration_title')}</h1>
            <p className="text-gray-400">{t('registration_subtitle_alt')}</p>
          </div>

          {/* Stepper */}
          <div className="mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -translate-y-1/2 hidden md:block"></div>
            <div className="flex flex-wrap md:flex-nowrap justify-between relative z-10 gap-4">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isHidden = (step.id === 2 && !isMinor() && currentStep !== 2);

                if (isHidden) return null;

                return (
                  <div
                    key={step.id}
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => isCompleted && setCurrentStep(step.id)}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xl
                        ${isActive ? 'bg-dark-primary text-white scale-110 ring-4 ring-indigo-500/20' :
                          isCompleted ? 'bg-green-500 text-white' : 'bg-dark-card text-gray-500 border border-gray-800'}
                      `}
                    >
                      {isCompleted ? <CheckCircle2 size={18} /> : step.icon}
                    </div>
                    <span className={`mt-2 text-[12px] font-bold uppercase tracking-widest ${isActive ? 'text-dark-primary' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-dark-card rounded-3xl border border-gray-800 shadow-2xl p-6 min-h-[550px]">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center bg-dark-card/50 p-4 rounded-2xl border border-gray-800/50">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-dark-secondary text-white hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center space-x-1">
                <ChevronLeft size={20} />
                <span className="text-[14px] font-bold opacity-50 group-hover:opacity-100 transition-opacity">F1</span>
              </div>
              <span>{t('common_back')}</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm font-medium">{t('common_step')} {currentStep}/6</span>
              <button
                onClick={currentStep === 6 ? handleSubmit : nextStep}
                disabled={submitting}
                className="flex items-center space-x-2 px-8 py-3 rounded-xl bg-dark-primary text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 group"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span>{currentStep === 6 ? t('common_finish') : t('common_next')}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-[14px] font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                        {currentStep === 6 ? 'Enter' : 'F2'}
                      </span>
                      {currentStep !== 6 && <ChevronRight size={20} />}
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Search khách hàng */}
        <div className="lg:col-span-4 h-[calc(100vh-100px)] sticky top-4">
          <CustomerList onSelectCustomer={handleSelectCustomer} />
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
    </div>
  );
};

export default RegistrationPage;
